/**
 * Google Apps Script — Webinar TEKAD Lead Handler
 *
 * Setup:
 * 1. Buat Google Sheet "Database Webinar TEKAD - Dari Bingung Arah Menjadi Siap Kerja"
 * 2. Buat tab "Leads" dengan header kolom sesuai PRD
 * 3. Paste kode ini ke Apps Script editor
 * 4. Set Script Property: FORM_TOKEN = (sama dengan VITE_FORM_TOKEN)
 * 5. Deploy sebagai Web App — Execute as: Me, Who has access: Anyone
 */

var SHEET_NAME = 'Leads';
var FORM_TOKEN_KEY = 'FORM_TOKEN';

var HEADERS = [
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
];

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    if (payload.honeypot) {
      return jsonResponse({ success: true, message: 'Lead saved' });
    }

    var expectedToken = PropertiesService.getScriptProperties().getProperty(FORM_TOKEN_KEY);
    if (!expectedToken || payload.token !== expectedToken) {
      return jsonResponse({ success: false, message: 'Invalid token' });
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
        return jsonResponse({ success: false, message: 'Field wajib kosong: ' + field });
      }
    }

    var sheet = getOrCreateSheet();
    ensureHeaders(sheet);

    var submittedAt = payload.submitted_at || new Date().toISOString();

    sheet.appendRow([
      submittedAt,
      String(payload.nama_orang_tua).trim(),
      String(payload.whatsapp).trim(),
      String(payload.whatsapp_normalized || '').trim(),
      String(payload.status_anak).trim(),
      String(payload.kondisi_anak).trim(),
      String(payload.kekhawatiran_utama || '').trim(),
      String(payload.kota).trim(),
      String(payload.bersedia_konsultasi).trim(),
      String(payload.source || 'direct').trim(),
      String(payload.utm_source || '').trim(),
      String(payload.utm_medium || '').trim(),
      String(payload.utm_campaign || '').trim(),
      String(payload.page_url || '').trim(),
      String(payload.user_agent || '').trim(),
      'new',
      '',
    ]);

    return jsonResponse({ success: true, message: 'Lead saved' });
  } catch (err) {
    return jsonResponse({ success: false, message: String(err) });
  }
}

function doGet() {
  return jsonResponse({ success: true, message: 'TEKAD Webinar Lead API is running' });
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return;
  }
  var existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var needsHeaders = existing.join('').trim() === '';
  if (needsHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}