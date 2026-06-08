/**
 * Google Apps Script — TEKAD Webinar Lead + Affiliate MVP Handler
 *
 * Setup:
 * 1. Google Sheet dengan tab: Leads, affiliates, settings
 * 2. Script Property: FORM_TOKEN (= VITE_FORM_TOKEN di frontend)
 * 3. Deploy Web App — Execute as: Me, Who has access: Anyone
 *
 * Actions (POST JSON):
 * - (tanpa action)     → submit lead webinar legacy (backward compatible)
 * - registerLead       → submit lead webinar (+ ref_code opsional)
 * - registerAffiliate  → daftar affiliate baru
 */

var SHEET_LEADS = 'Leads';
var SHEET_AFFILIATES = 'affiliates';
var SHEET_SETTINGS = 'settings';
var FORM_TOKEN_KEY = 'FORM_TOKEN';

var LEADS_HEADERS = [
  'submitted_at',
  'nama_orang_tua',
  'whatsapp',
  'whatsapp_normalized',
  'status_anak',
  'kondisi_anak',
  'kekhawatiran_utama',
  'kota',
  'bersedia_konsultasi',
  'source',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'page_url',
  'user_agent',
  'follow_up_status',
  'notes',
  'ref_code',
  'affiliate_name',
];

var AFFILIATES_HEADERS = [
  'affiliate_id',
  'tanggal_daftar',
  'nama',
  'whatsapp',
  'email',
  'kota',
  'profesi',
  'media_sosial',
  'rekening',
  'nama_rekening',
  'kode_ref',
  'link_ref',
  'status',
  'catatan_admin',
];

var SETTINGS_DEFAULTS = {
  base_webinar_url: 'https://domaintekad.com/webinar',
  whatsapp_redirect_number: '',
  default_commission: '500000',
  affiliate_status_default: 'active',
};

var AFFILIATE_CODE_MAX_RETRY = 10;

// ── HTTP handlers ──────────────────────────────────────────────

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action ? String(payload.action).trim() : '';

    if (action === 'registerAffiliate') {
      return handleRegisterAffiliate(payload);
    }

    // Legacy webinar lead (no action) + explicit registerLead
    return handleRegisterLead(payload);
  } catch (err) {
    return legacyResponse(false, String(err));
  }
}

function doGet() {
  return jsonResponse({
    success: true,
    message: 'TEKAD Webinar Lead + Affiliate API is running',
    actions: ['registerLead', 'registerAffiliate'],
  });
}

// ── Lead webinar ───────────────────────────────────────────────

function handleRegisterLead(payload) {
  if (payload.honeypot) {
    return legacyResponse(true, 'Lead saved');
  }

  if (!validateToken(payload)) {
    return legacyResponse(false, 'Invalid token');
  }

  var required = [
    'nama_orang_tua',
    'whatsapp',
    'status_anak',
    'kondisi_anak',
    'kota',
    'bersedia_konsultasi',
  ];

  for (var i = 0; i < required.length; i++) {
    var field = required[i];
    if (!payload[field] || String(payload[field]).trim() === '') {
      return legacyResponse(false, 'Field wajib kosong: ' + field);
    }
  }

  var sheet = getOrCreateSheet(SHEET_LEADS, LEADS_HEADERS);
  ensureHeaders(sheet, LEADS_HEADERS);

  var submittedAt = payload.submitted_at || new Date().toISOString();
  var whatsappRaw = sanitizeText(payload.whatsapp);
  var whatsappNorm = sanitizeText(payload.whatsapp_normalized) || normalizeWhatsApp(whatsappRaw);
  var refCode = resolveRefCode(payload.ref_code);
  var affiliateLookup = lookupAffiliateByCode(refCode);
  var affiliateName = '';

  if (refCode === 'DIRECT') {
    affiliateName = '';
  } else if (affiliateLookup) {
    affiliateName = affiliateLookup.nama;
  } else {
    affiliateName = 'UNKNOWN';
  }

  appendRowByHeaders(sheet, LEADS_HEADERS, {
    submitted_at: submittedAt,
    nama_orang_tua: sanitizeText(payload.nama_orang_tua),
    whatsapp: whatsappRaw,
    whatsapp_normalized: whatsappNorm,
    status_anak: sanitizeText(payload.status_anak),
    kondisi_anak: sanitizeText(payload.kondisi_anak),
    kekhawatiran_utama: sanitizeText(payload.kekhawatiran_utama),
    kota: sanitizeText(payload.kota),
    bersedia_konsultasi: sanitizeText(payload.bersedia_konsultasi),
    source: sanitizeText(payload.source) || 'direct',
    utm_source: sanitizeText(payload.utm_source),
    utm_medium: sanitizeText(payload.utm_medium),
    utm_campaign: sanitizeText(payload.utm_campaign),
    page_url: sanitizeText(payload.page_url),
    user_agent: sanitizeText(payload.user_agent),
    follow_up_status: 'new',
    notes: '',
    ref_code: refCode,
    affiliate_name: affiliateName,
  });

  return legacyResponse(true, 'Lead saved');
}

// ── Affiliate registration ─────────────────────────────────────

function handleRegisterAffiliate(payload) {
  if (!validateToken(payload)) {
    return affiliateResponse(false, 'VALIDATION_ERROR', 'Invalid token');
  }

  var nama = sanitizeText(payload.nama);
  var whatsapp = sanitizeText(payload.whatsapp);
  var kota = sanitizeText(payload.kota);
  var agreeTerms = payload.agree_terms === true || payload.agree_terms === 'true';

  if (!nama || nama.length < 2) {
    return affiliateResponse(false, 'VALIDATION_ERROR', 'Nama wajib diisi (minimal 2 karakter).');
  }

  if (!whatsapp) {
    return affiliateResponse(false, 'VALIDATION_ERROR', 'Nomor WhatsApp wajib diisi.');
  }

  var whatsappNorm = normalizeWhatsApp(whatsapp);
  if (whatsappNorm.length < 10 || whatsappNorm.length > 15) {
    return affiliateResponse(
      false,
      'VALIDATION_ERROR',
      'Nomor WhatsApp tidak valid. Minimal 10 digit, maksimal 15 digit.'
    );
  }

  if (!kota) {
    return affiliateResponse(false, 'VALIDATION_ERROR', 'Kota wajib diisi.');
  }

  if (!agreeTerms) {
    return affiliateResponse(false, 'VALIDATION_ERROR', 'Persetujuan syarat affiliate wajib dicentang.');
  }

  var sheet = getOrCreateSheet(SHEET_AFFILIATES, AFFILIATES_HEADERS);
  ensureHeaders(sheet, AFFILIATES_HEADERS);

  var kodeRef = generateAffiliateCode(nama);
  var baseUrl = getSetting('base_webinar_url', SETTINGS_DEFAULTS.base_webinar_url);
  var linkRef = buildAffiliateLink(baseUrl, kodeRef);
  var affiliateId = generateAffiliateId();
  var statusDefault = getSetting('affiliate_status_default', SETTINGS_DEFAULTS.affiliate_status_default);
  var tanggalDaftar = payload.submitted_at || new Date().toISOString();

  appendRowByHeaders(sheet, AFFILIATES_HEADERS, {
    affiliate_id: affiliateId,
    tanggal_daftar: tanggalDaftar,
    nama: nama,
    whatsapp: whatsapp,
    email: sanitizeText(payload.email),
    kota: kota,
    profesi: sanitizeText(payload.profesi),
    media_sosial: sanitizeText(payload.media_sosial),
    rekening: sanitizeText(payload.rekening),
    nama_rekening: sanitizeText(payload.nama_rekening),
    kode_ref: kodeRef,
    link_ref: linkRef,
    status: statusDefault,
    catatan_admin: '',
  });

  return jsonResponse({
    ok: true,
    affiliate_id: affiliateId,
    kode_ref: kodeRef,
    link_ref: linkRef,
    caption: buildAffiliateCaption(linkRef),
  });
}

// ── Helpers: auth & response ───────────────────────────────────

function validateToken(payload) {
  var expectedToken = PropertiesService.getScriptProperties().getProperty(FORM_TOKEN_KEY);
  return !!(expectedToken && payload.token === expectedToken);
}

function legacyResponse(success, message) {
  return jsonResponse({ success: success, message: message });
}

function affiliateResponse(ok, error, message) {
  return jsonResponse({ ok: ok, error: error, message: message });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// ── Helpers: text & phone ──────────────────────────────────────

function sanitizeText(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function normalizeWhatsApp(value) {
  var raw = sanitizeText(value);
  if (!raw) return '';

  var digits = raw.replace(/\D/g, '');

  if (digits.indexOf('62') === 0) {
    return digits;
  }

  if (digits.indexOf('0') === 0) {
    return '62' + digits.slice(1);
  }

  return digits;
}

function resolveRefCode(value) {
  var code = sanitizeText(value).toUpperCase();
  if (!code) return 'DIRECT';
  return code;
}

// ── Helpers: sheets ────────────────────────────────────────────

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (headers && headers.length) {
    ensureHeaders(sheet, headers);
  }
  return sheet;
}

function ensureHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    return;
  }

  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var existingRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var existingHeaders = [];

  for (var i = 0; i < existingRow.length; i++) {
    var cell = sanitizeText(existingRow[i]);
    if (cell) existingHeaders.push(cell);
  }

  if (existingHeaders.length === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  var missing = [];
  for (var j = 0; j < headers.length; j++) {
    if (existingHeaders.indexOf(headers[j]) === -1) {
      missing.push(headers[j]);
    }
  }

  if (missing.length > 0) {
    var startCol = existingHeaders.length + 1;
    sheet.getRange(1, startCol, 1, startCol + missing.length - 1).setValues([missing]);
  }
}

function appendRowByHeaders(sheet, expectedHeaders, dataMap) {
  ensureHeaders(sheet, expectedHeaders);
  var lastCol = sheet.getLastColumn();
  var headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var row = [];

  for (var i = 0; i < headerRow.length; i++) {
    var key = sanitizeText(headerRow[i]);
    row.push(key && dataMap.hasOwnProperty(key) ? dataMap[key] : '');
  }

  sheet.appendRow(row);
}

// ── Helpers: settings ──────────────────────────────────────────

function getSetting(key, fallback) {
  var sheet = getOrCreateSheet(SHEET_SETTINGS, ['key', 'value']);
  ensureHeaders(sheet, ['key', 'value']);

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return fallback || '';
  }

  var data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  for (var i = 0; i < data.length; i++) {
    if (sanitizeText(data[i][0]) === key) {
      var val = sanitizeText(data[i][1]);
      return val || fallback || '';
    }
  }

  return fallback || '';
}

// ── Helpers: affiliate code ────────────────────────────────────

function generateAffiliateId() {
  var datePart = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd');
  var randomPart = Utilities.getUuid().replace(/-/g, '').slice(0, 6).toUpperCase();
  return 'AFF-' + datePart + '-' + randomPart;
}

function extractFirstName(nama) {
  var clean = sanitizeText(nama);
  if (!clean) return 'MITRA';
  var first = clean.split(/\s+/)[0];
  first = first.replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (!first) return 'MITRA';
  if (first.length > 12) first = first.slice(0, 12);
  return first;
}

function randomFourDigits() {
  var n = Math.floor(Math.random() * 10000);
  var s = String(n);
  while (s.length < 4) s = '0' + s;
  return s;
}

function generateAffiliateCode(nama) {
  var prefix = extractFirstName(nama);
  var attempt = 0;
  var code = '';

  while (attempt < AFFILIATE_CODE_MAX_RETRY) {
    code = prefix + '-' + randomFourDigits();
    if (!isAffiliateCodeExists(code)) {
      return code;
    }
    attempt++;
  }

  var suffix = String(Math.floor(Math.random() * 90) + 10);
  code = prefix + '-' + randomFourDigits() + '-' + suffix;

  if (isAffiliateCodeExists(code)) {
    code = prefix + '-' + randomFourDigits() + '-' + Utilities.getUuid().slice(0, 4).toUpperCase();
  }

  return code;
}

function isAffiliateCodeExists(code) {
  var sheet = getOrCreateSheet(SHEET_AFFILIATES, AFFILIATES_HEADERS);
  ensureHeaders(sheet, AFFILIATES_HEADERS);

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  var lastCol = sheet.getLastColumn();
  var headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var codeColIndex = -1;

  for (var i = 0; i < headerRow.length; i++) {
    if (sanitizeText(headerRow[i]) === 'kode_ref') {
      codeColIndex = i + 1;
      break;
    }
  }

  if (codeColIndex === -1) return false;

  var values = sheet.getRange(2, codeColIndex, lastRow - 1, 1).getValues();
  var target = sanitizeText(code).toUpperCase();

  for (var j = 0; j < values.length; j++) {
    if (sanitizeText(values[j][0]).toUpperCase() === target) {
      return true;
    }
  }

  return false;
}

function lookupAffiliateByCode(refCode) {
  var code = resolveRefCode(refCode);
  if (code === 'DIRECT') return null;

  var sheet = getOrCreateSheet(SHEET_AFFILIATES, AFFILIATES_HEADERS);
  ensureHeaders(sheet, AFFILIATES_HEADERS);

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  var lastCol = sheet.getLastColumn();
  var headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var codeCol = -1;
  var namaCol = -1;
  var statusCol = -1;

  for (var i = 0; i < headerRow.length; i++) {
    var h = sanitizeText(headerRow[i]);
    if (h === 'kode_ref') codeCol = i + 1;
    if (h === 'nama') namaCol = i + 1;
    if (h === 'status') statusCol = i + 1;
  }

  if (codeCol === -1) return null;

  var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  for (var r = 0; r < rows.length; r++) {
    var rowCode = sanitizeText(rows[r][codeCol - 1]).toUpperCase();
    if (rowCode !== code) continue;

    var status = statusCol > 0 ? sanitizeText(rows[r][statusCol - 1]).toLowerCase() : 'active';
    if (status === 'inactive') return null;

    return {
      kode_ref: rowCode,
      nama: namaCol > 0 ? sanitizeText(rows[r][namaCol - 1]) : '',
    };
  }

  return null;
}

function buildAffiliateLink(baseUrl, kodeRef) {
  var base = sanitizeText(baseUrl) || SETTINGS_DEFAULTS.base_webinar_url;
  var separator = base.indexOf('?') >= 0 ? '&' : '?';
  return base + separator + 'ref=' + encodeURIComponent(kodeRef);
}

function buildAffiliateCaption(linkRef) {
  return (
    'Bunda/Ayah, kalau anak sedang bingung arah setelah lulus sekolah atau belum siap masuk dunia kerja, TEKAD mengadakan webinar gratis:\n\n' +
    '"Dari Bingung Arah Menjadi Siap Kerja"\n\n' +
    'Di webinar ini akan dibahas bagaimana anak bisa mulai membangun skill digital, AI, portofolio, dan kesiapan kerja tanpa harus bingung mulai dari mana.\n\n' +
    'Daftar gratis di sini:\n' +
    linkRef
  );
}