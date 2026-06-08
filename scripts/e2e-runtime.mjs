/**
 * Runtime E2E tests for TEKAD Webinar MVP
 * Run: node scripts/e2e-runtime.mjs
 */
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5175';

function loadEnv() {
  const envPath = resolve(ROOT, '.env.local');
  const content = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    env[key] = rest.join('=').trim();
  }
  return env;
}

const env = loadEnv();
const GAS_URL = env.VITE_GOOGLE_SCRIPT_URL;
const FORM_TOKEN = env.VITE_FORM_TOKEN;
const WA_REDIRECT = env.VITE_WHATSAPP_REDIRECT_URL;

const results = [];

function log(msg) {
  console.log(msg);
}

function record(name, pass, detail = '') {
  results.push({ name, pass, detail });
  log(`${pass ? 'PASS' : 'FAIL'} — ${name}${detail ? `: ${detail}` : ''}`);
}

function normalizeWhatsApp(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  return digits;
}

async function postToGas(payload) {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { success: false, message: `Invalid JSON: ${text.slice(0, 200)}` };
  }
  return { status: res.status, json, raw: text };
}

function buildPayload(overrides = {}) {
  const ts = Date.now();
  return {
    token: FORM_TOKEN,
    submitted_at: new Date().toISOString(),
    nama_orang_tua: `E2E Test ${ts}`,
    whatsapp: '081234567890',
    whatsapp_normalized: '6281234567890',
    status_anak: 'Mahasiswa',
    kondisi_anak: 'Masih bingung arah',
    kekhawatiran_utama: '',
    kota: 'Cirebon',
    bersedia_konsultasi: 'Ya, saya bersedia',
    source: 'direct',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    page_url: 'http://localhost:5175/',
    user_agent: 'E2E-Test-Agent',
    honeypot: '',
    ...overrides,
  };
}

async function testGasDirect() {
  log('\n=== GAS Direct API Tests ===');

  // Wrong token
  const bad = await postToGas(buildPayload({ token: 'wrong-token-xyz', nama_orang_tua: 'E2E Bad Token' }));
  record(
    'Error: wrong token rejected',
    bad.json.success === false,
    bad.json.message || bad.raw.slice(0, 120)
  );

  // Direct source
  const direct = await postToGas(
    buildPayload({
      nama_orang_tua: 'E2E Direct No UTM',
      source: 'direct',
      whatsapp: '081111111101',
      whatsapp_normalized: '6281111111101',
    })
  );
  record('Submit: source direct (API)', direct.json.success === true, direct.json.message);

  // wa_status
  const wa = await postToGas(
    buildPayload({
      nama_orang_tua: 'E2E Source WA Status',
      source: 'wa_status',
      whatsapp: '081111111102',
      whatsapp_normalized: '6281111111102',
    })
  );
  record('Submit: source wa_status (API)', wa.json.success === true, `source=wa_status`);

  // UTM
  const utm = await postToGas(
    buildPayload({
      nama_orang_tua: 'E2E UTM Facebook',
      source: 'direct',
      utm_source: 'facebook',
      utm_medium: 'organic',
      utm_campaign: 'webinar_siap_kerja',
      whatsapp: '081111111103',
      whatsapp_normalized: '6281111111103',
    })
  );
  record('Submit: UTM params (API)', utm.json.success === true, 'utm facebook/organic/webinar_siap_kerja');

  // WA 08 format normalization
  const wa08 = '081234567804';
  const norm08 = normalizeWhatsApp(wa08);
  const r08 = await postToGas(
    buildPayload({
      nama_orang_tua: 'E2E WA Format 08',
      whatsapp: wa08,
      whatsapp_normalized: norm08,
      whatsapp_check: norm08,
    })
  );
  record(
    'Submit: WhatsApp 08 format (API)',
    r08.json.success === true && norm08 === '6281234567804',
    `${wa08} → ${norm08}`
  );

  // WA +628 format
  const waPlus = '+6281234567805';
  const normPlus = normalizeWhatsApp(waPlus);
  const rPlus = await postToGas(
    buildPayload({
      nama_orang_tua: 'E2E WA Format +628',
      whatsapp: waPlus,
      whatsapp_normalized: normPlus,
    })
  );
  record(
    'Submit: WhatsApp +628 format (API)',
    rPlus.json.success === true && normPlus === '6281234567805',
    `${waPlus} → ${normPlus}`
  );

  return {
    samples: [
      { name: 'E2E Direct No UTM', source: 'direct', wa: '6281111111101' },
      { name: 'E2E Source WA Status', source: 'wa_status', wa: '6281111111102' },
      { name: 'E2E UTM Facebook', utm: 'facebook/organic/webinar_siap_kerja', wa: '6281111111103' },
      { name: 'E2E WA Format 08', wa: '6281234567804' },
      { name: 'E2E WA Format +628', wa: '6281234567805' },
    ],
  };
}

function form(page) {
  return page.locator('.form-overlay');
}

async function openForm(page) {
  await page.getByRole('button', { name: 'Daftar Webinar Gratis' }).first().click();
  await form(page).waitFor({ state: 'visible' });
}

async function fillFormSteps(page, { nama, whatsapp, skipKekhawatiran = true }) {
  await openForm(page);
  await form(page).getByRole('button', { name: 'Mulai Daftar' }).click();

  await form(page).getByPlaceholder('Contoh: Ibu Siti / Bapak Ahmad').fill(nama);
  await form(page).getByRole('button', { name: 'Lanjut' }).click();

  await form(page).getByPlaceholder('08xxxxxxxxxx').fill(whatsapp);
  await form(page).getByRole('button', { name: 'Lanjut' }).click();

  await form(page).getByRole('button', { name: 'Mahasiswa' }).click();
  await form(page).getByRole('button', { name: 'Lanjut' }).click();

  await form(page).getByRole('button', { name: 'Masih bingung arah' }).click();
  await form(page).getByRole('button', { name: 'Lanjut' }).click();

  if (skipKekhawatiran) {
    await form(page).getByRole('button', { name: 'Lewati' }).click();
  }

  await form(page).getByPlaceholder('Contoh: Cirebon / Indramayu / Kuningan').fill('Cirebon');
  await form(page).getByRole('button', { name: 'Lanjut' }).click();

  await form(page).getByRole('button', { name: 'Ya, saya bersedia' }).click();
  await form(page).getByRole('button', { name: 'Lanjut' }).click();
}

async function testBrowserValidation(page) {
  log('\n=== Browser Validation Tests ===');
  await page.goto(BASE_URL);
  await openForm(page);
  await form(page).getByRole('button', { name: 'Mulai Daftar' }).click();

  // Try next without nama
  await form(page).getByRole('button', { name: 'Lanjut' }).click();
  const namaError = await form(page).locator('.form-error').isVisible();
  record('Validation: nama wajib', namaError, await form(page).locator('.form-error').textContent());

  await form(page).getByPlaceholder('Contoh: Ibu Siti / Bapak Ahmad').fill('E2E Validation Test');
  await form(page).getByRole('button', { name: 'Lanjut' }).click();

  // Try next without whatsapp
  await form(page).getByRole('button', { name: 'Lanjut' }).click();
  const waError = await form(page).locator('.form-error').isVisible();
  record('Validation: WhatsApp wajib', waError);

  await form(page).getByPlaceholder('08xxxxxxxxxx').fill('08123');
  await form(page).getByRole('button', { name: 'Lanjut' }).click();
  const waShort = await form(page).locator('.form-error').isVisible();
  record('Validation: WhatsApp terlalu pendek', waShort, await form(page).locator('.form-error').textContent());

  await form(page).getByRole('button', { name: 'Tutup form' }).click();
}

async function testBrowserSubmitWithRedirect(page, query, { nama, whatsapp }) {
  const url = query ? `${BASE_URL}/?${query}` : BASE_URL;
  let gasResponse = null;
  let capturedPayload = null;

  page.on('request', (req) => {
    if (req.url().includes('script.google.com/macros') && req.method() === 'POST') {
      try {
        capturedPayload = JSON.parse(req.postData() || '{}');
      } catch { /* ignore */ }
    }
  });

  await page.goto(url);
  await fillFormSteps(page, { nama, whatsapp });

  const submitPromise = page.waitForResponse(
    (r) => r.url().includes('script.google.com/macros') && r.request().method() === 'POST',
    { timeout: 30000 }
  );

  await form(page).getByRole('button', { name: 'Kirim Pendaftaran' }).click();
  const gasRes = await submitPromise;
  try {
    gasResponse = JSON.parse(await gasRes.text());
  } catch {
    gasResponse = { success: false, message: 'parse error' };
  }

  const successVisible = await form(page)
    .locator('.form-success')
    .isVisible({ timeout: 3000 })
    .catch(() => false);

  // Wait for redirect (wa.me resolves to api.whatsapp.com)
  let redirected = false;
  try {
    await page.waitForURL(/whatsapp\.com/, { timeout: 10000 });
    redirected = true;
  } catch {
    redirected = /wa\.me|whatsapp\.com/i.test(page.url());
  }

  // Redirect only happens after successful submit in app code
  const submitOk = redirected && !!capturedPayload?.nama_orang_tua;

  return {
    gasResponse,
    successVisible,
    redirected,
    submitOk,
    finalUrl: page.url(),
    capturedPayload,
  };
}

async function testBrowserWrongToken(page) {
  log('\n=== Browser Wrong Token Test ===');

  await page.route(GAS_URL, async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: JSON.stringify({ success: false, message: 'Invalid token' }),
      });
      return;
    }
    await route.continue();
  });

  await page.goto(BASE_URL);
  await fillFormSteps(page, { nama: 'E2E Wrong Token Browser', whatsapp: '081111111199' });

  await form(page).getByRole('button', { name: 'Kirim Pendaftaran' }).click();

  await page.waitForTimeout(1500);
  const errorText = await form(page).locator('.form-error').first().textContent().catch(() => '');
  const errorVisible = !!errorText && /invalid|belum berhasil/i.test(errorText);
  const stillOnForm = await form(page).isVisible();
  const notRedirected = !/wa\.me|whatsapp\.com/i.test(page.url());

  record(
    'Error: wrong token no redirect (browser)',
    errorVisible && stillOnForm && notRedirected,
    `error="${(errorText || '').trim()}", on form=${stillOnForm}, no redirect=${notRedirected}`
  );
}

async function assertNoHorizontalOverflow(page) {
  return page.evaluate(() => {
    const docWidth = document.documentElement.scrollWidth;
    const bodyWidth = document.body.scrollWidth;
    const viewWidth = window.innerWidth;
    const ok = docWidth <= viewWidth + 1 && bodyWidth <= viewWidth + 1;
    return { docWidth, bodyWidth, viewWidth, ok };
  });
}

async function findOverflowOffenders(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const offenders = [];
    for (const el of document.querySelectorAll('body *')) {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;
      if (rect.right > vw + 1) {
        offenders.push({
          tag: el.tagName,
          className: String(el.className || '').slice(0, 100),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          text: (el.textContent || '').trim().slice(0, 60),
        });
      }
    }
    return offenders.slice(0, 5);
  });
}

async function assertButtonInViewport(page, name) {
  const box = await form(page).getByRole('button', { name }).boundingBox();
  if (!box) return { ok: false, detail: 'button not found' };
  const viewWidth = await page.evaluate(() => window.innerWidth);
  const viewHeight = await page.evaluate(() => window.innerHeight);
  const ok =
    box.x >= -1 &&
    box.y >= -1 &&
    box.x + box.width <= viewWidth + 1 &&
    box.y + box.height <= viewHeight + 1;
  return {
    ok,
    detail: `x=${Math.round(box.x)} w=${Math.round(box.width)} viewport=${viewWidth}x${viewHeight}`,
  };
}

async function testMobileLandingOverflow(page) {
  log('\n=== Mobile Landing Overflow Tests ===');

  const viewports = [
    { width: 320, height: 678 },
    { width: 360, height: 740 },
    { width: 390, height: 844 },
    { width: 414, height: 896 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize(vp);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const scrollPositions = [
      0,
      Math.floor(scrollHeight * 0.25),
      Math.floor(scrollHeight * 0.5),
      Math.floor(scrollHeight * 0.75),
      Math.max(0, scrollHeight - vp.height),
    ];

    for (const y of scrollPositions) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(120);

      const overflow = await assertNoHorizontalOverflow(page);
      const offenders = overflow.ok ? [] : await findOverflowOffenders(page);
      const offenderDetail = offenders
        .map((o) => `${o.tag}.${o.className} right=${o.right} "${o.text}"`)
        .join(' | ');

      record(
        `Landing ${vp.width}x${vp.height} scroll@${y}: no overflow`,
        overflow.ok && offenders.length === 0,
        overflow.ok
          ? `doc=${overflow.docWidth}, body=${overflow.bodyWidth}, vw=${overflow.viewWidth}`
          : offenderDetail || `doc=${overflow.docWidth}, body=${overflow.bodyWidth}, vw=${overflow.viewWidth}`
      );
    }

    await page.evaluate(() => {
      document.getElementById('tentang')?.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(150);

    const tekadGrid = await page.evaluate(() => {
      const grid = document.querySelector('#tentang .trust-grid');
      if (!grid) return { columns: null, singleColumn: false };
      const columns = getComputedStyle(grid).gridTemplateColumns;
      const trackCount = columns.split(' ').filter(Boolean).length;
      return { columns, singleColumn: trackCount === 1 };
    });
    record(
      `Landing ${vp.width}x${vp.height}: TEKAD trust cards single column`,
      tekadGrid.singleColumn,
      `columns=${tekadGrid.columns}`
    );

    const tekadOffenders = await findOverflowOffenders(page);
    record(
      `Landing ${vp.width}x${vp.height}: TEKAD section no element overflow`,
      tekadOffenders.length === 0,
      tekadOffenders.map((o) => `${o.className} right=${o.right}`).join(' | ') || 'none'
    );

    await openForm(page);
    const formOverflow = await assertNoHorizontalOverflow(page);
    record(
      `Landing ${vp.width}x${vp.height}: form open no overflow`,
      formOverflow.ok,
      `doc=${formOverflow.docWidth}, vw=${formOverflow.viewWidth}`
    );

    await form(page).getByRole('button', { name: 'Mulai Daftar' }).click();
    await form(page).getByPlaceholder('Contoh: Ibu Siti / Bapak Ahmad').fill('E2E Overflow');
    await form(page).getByRole('button', { name: 'Lanjut' }).click();

    const formStepOverflow = await assertNoHorizontalOverflow(page);
    record(
      `Landing ${vp.width}x${vp.height}: form step 2 no overflow`,
      formStepOverflow.ok,
      `doc=${formStepOverflow.docWidth}, vw=${formStepOverflow.viewWidth}`
    );

    await form(page).getByRole('button', { name: 'Tutup form' }).click();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(150);

    const sticky = page.locator('.sticky-cta');
    const stickyVisible = await sticky.isVisible().catch(() => false);
    const footer = page.locator('.footer');
    const footerBox = await footer.boundingBox();
    const stickyBox = stickyVisible ? await sticky.boundingBox() : null;
    const footerCovered =
      stickyVisible &&
      footerBox &&
      stickyBox &&
      stickyBox.y < footerBox.y + footerBox.height - 8;

    record(
      `Landing ${vp.width}x${vp.height}: sticky CTA not covering footer content`,
      !footerCovered,
      `sticky=${stickyVisible}, footerBottom=${footerBox ? Math.round(footerBox.y + footerBox.height) : 'n/a'}`
    );
  }
}

async function testMobileFormLayout(page) {
  log('\n=== Mobile Form Layout Tests ===');

  const viewports = [
    { width: 320, height: 678 },
    { width: 360, height: 740 },
    { width: 390, height: 844 },
    { width: 414, height: 896 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize(vp);
    await page.goto(BASE_URL);
    await openForm(page);

    const overflow = await assertNoHorizontalOverflow(page);
    record(
      `Mobile ${vp.width}x${vp.height}: no horizontal overflow`,
      overflow.ok,
      `scrollWidth=${overflow.docWidth}, innerWidth=${overflow.viewWidth}`
    );

    const mulai = await assertButtonInViewport(page, 'Mulai Daftar');
    record(
      `Mobile ${vp.width}x${vp.height}: Mulai Daftar in viewport`,
      mulai.ok,
      mulai.detail
    );

    const stickyVisible = await page.locator('.sticky-cta').isVisible().catch(() => false);
    record(
      `Mobile ${vp.width}x${vp.height}: sticky CTA hidden when form open`,
      !stickyVisible,
      `visible=${stickyVisible}`
    );

    await form(page).getByRole('button', { name: 'Mulai Daftar' }).click();
    await form(page).getByPlaceholder('Contoh: Ibu Siti / Bapak Ahmad').fill('E2E Mobile');
    await form(page).getByRole('button', { name: 'Lanjut' }).click();

    const overflowStep2 = await assertNoHorizontalOverflow(page);
    record(
      `Mobile ${vp.width}x${vp.height}: no overflow after step 2`,
      overflowStep2.ok,
      `scrollWidth=${overflowStep2.docWidth}, innerWidth=${overflowStep2.viewWidth}`
    );

    await form(page).getByRole('button', { name: 'Tutup form' }).click();
  }
}

async function clearReferralStorage(page) {
  await page.goto(BASE_URL);
  await page.evaluate(() => localStorage.removeItem('tekad_ref_code'));
}

async function mockGasPost(page, responder) {
  await page.route(GAS_URL, async (route) => {
    if (route.request().method() === 'POST') {
      let payload = null;
      try {
        payload = JSON.parse(route.request().postData() || '{}');
      } catch {
        payload = null;
      }

      const body =
        typeof responder === 'function' ? await responder(payload, route) : responder;

      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: JSON.stringify(body),
      });
      return;
    }
    await route.continue();
  });
}

async function gotoAffiliate(page) {
  await page.goto(`${BASE_URL}/affiliate`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Jadi Mitra Affiliate TEKAD' }).waitFor();
}

async function fillAffiliateRequired(page, { nama, whatsapp, kota, agreeTerms = false }) {
  if (nama !== undefined) {
    await page.getByPlaceholder('Contoh: Bima Senna').fill(nama);
  }
  if (whatsapp !== undefined) {
    await page.getByPlaceholder('08xxxxxxxxxx').fill(whatsapp);
  }
  if (kota !== undefined) {
    await page.getByPlaceholder('Contoh: Cirebon').fill(kota);
  }
  if (agreeTerms) {
    await page.locator('.affiliate-consent input[type="checkbox"]').check();
  }
}

async function submitAffiliateForm(page) {
  await page.getByRole('button', { name: 'Daftar & Buat Link Affiliate' }).click();
}

async function affiliateErrorText(page) {
  return (await page.locator('.affiliate-form__error').textContent()) || '';
}

const AFFILIATE_SUCCESS_MOCK = {
  ok: true,
  affiliate_id: 'AFF-TEST-001',
  kode_ref: 'BIMA-4821',
  link_ref: 'https://example.com/webinar?ref=BIMA-4821',
  caption: 'Caption test https://example.com/webinar?ref=BIMA-4821',
};

async function testAffiliatePage(context) {
  log('\n=== Affiliate Page Tests ===');

  // A. Render page + required fields
  const renderPage = await context.newPage();
  await gotoAffiliate(renderPage);
  const headlineVisible = await renderPage
    .getByRole('heading', { name: 'Jadi Mitra Affiliate TEKAD' })
    .isVisible();
  const namaField = await renderPage.getByPlaceholder('Contoh: Bima Senna').isVisible();
  const waField = await renderPage.getByPlaceholder('08xxxxxxxxxx').isVisible();
  const kotaField = await renderPage.getByPlaceholder('Contoh: Cirebon').isVisible();
  const consentVisible = await renderPage.locator('.affiliate-consent').isVisible();
  record(
    'Affiliate: page render + required fields',
    headlineVisible && namaField && waField && kotaField && consentVisible
  );

  for (const width of [390, 414]) {
    await renderPage.setViewportSize({ width, height: 844 });
    await gotoAffiliate(renderPage);
    const overflow = await assertNoHorizontalOverflow(renderPage);
    record(
      `Affiliate: no horizontal overflow ${width}px`,
      overflow.ok,
      `doc=${overflow.docWidth}, vw=${overflow.viewWidth}`
    );
  }

  // B. Validation
  const validationPage = await context.newPage();
  await gotoAffiliate(validationPage);
  await submitAffiliateForm(validationPage);
  const namaErr = await affiliateErrorText(validationPage);
  record('Affiliate: validation nama wajib', /Nama wajib diisi/i.test(namaErr), namaErr.trim());

  await fillAffiliateRequired(validationPage, { nama: 'E2E Affiliate' });
  await submitAffiliateForm(validationPage);
  const waErr = await affiliateErrorText(validationPage);
  record(
    'Affiliate: validation WhatsApp wajib',
    /WhatsApp wajib diisi/i.test(waErr),
    waErr.trim()
  );

  await fillAffiliateRequired(validationPage, { whatsapp: '081234567890' });
  await submitAffiliateForm(validationPage);
  const kotaErr = await affiliateErrorText(validationPage);
  record('Affiliate: validation kota wajib', /Kota wajib diisi/i.test(kotaErr), kotaErr.trim());

  await fillAffiliateRequired(validationPage, { kota: 'Cirebon' });
  await submitAffiliateForm(validationPage);
  const termsErr = await affiliateErrorText(validationPage);
  record(
    'Affiliate: validation agree_terms wajib',
    /menyetujui syarat affiliate/i.test(termsErr),
    termsErr.trim()
  );

  await fillAffiliateRequired(validationPage, { agreeTerms: true, whatsapp: '08123' });
  await submitAffiliateForm(validationPage);
  const waShortErr = await affiliateErrorText(validationPage);
  record(
    'Affiliate: validation WhatsApp minimal 10 digit',
    /Minimal 10 digit/i.test(waShortErr),
    waShortErr.trim()
  );

  // C. Submit success with mock GAS
  const successPage = await context.newPage();
  let affiliatePayload = null;
  await mockGasPost(successPage, (payload) => {
    affiliatePayload = payload;
    return AFFILIATE_SUCCESS_MOCK;
  });
  await gotoAffiliate(successPage);
  await fillAffiliateRequired(successPage, {
    nama: 'E2E Affiliate Success',
    whatsapp: '081234567801',
    kota: 'Cirebon',
    agreeTerms: true,
  });
  await submitAffiliateForm(successPage);
  await successPage.locator('.affiliate-success').waitFor({ state: 'visible', timeout: 5000 });

  const successTitle = await successPage.locator('.affiliate-success__title').textContent();
  const codeText = await successPage.locator('.affiliate-success__code').textContent();
  const linkText = await successPage.locator('.affiliate-success__link-box a').textContent();
  const copyLinkBtn = await successPage.getByRole('button', { name: 'Copy Link' }).isVisible();
  const copyCaptionBtn = await successPage
    .getByRole('button', { name: 'Copy Caption Promosi' })
    .isVisible();

  record(
    'Affiliate: submit success payload',
    affiliatePayload?.action === 'registerAffiliate' &&
      affiliatePayload?.token === FORM_TOKEN &&
      affiliatePayload?.nama === 'E2E Affiliate Success' &&
      affiliatePayload?.whatsapp === '081234567801' &&
      affiliatePayload?.kota === 'Cirebon' &&
      affiliatePayload?.agree_terms === true,
    `action=${affiliatePayload?.action}, agree_terms=${affiliatePayload?.agree_terms}`
  );
  record(
    'Affiliate: success card content',
    /Pendaftaran Berhasil/i.test(successTitle || '') &&
      codeText?.trim() === 'BIMA-4821' &&
      /BIMA-4821/.test(linkText || '') &&
      copyLinkBtn &&
      copyCaptionBtn,
    `code=${codeText?.trim()}, link=${(linkText || '').trim().slice(0, 60)}`
  );

  await successPage.getByRole('button', { name: 'Copy Link' }).click();
  await successPage.waitForTimeout(300);
  const successStillVisible = await successPage.locator('.affiliate-success').isVisible();
  record('Affiliate: success card persists after copy', successStillVisible);

  // D. Submit error with mock GAS
  const errorPage = await context.newPage();
  await mockGasPost(errorPage, {
    ok: false,
    error: 'VALIDATION_ERROR',
    message: 'Nomor WhatsApp wajib diisi.',
  });
  await gotoAffiliate(errorPage);
  await fillAffiliateRequired(errorPage, {
    nama: 'E2E Affiliate Error',
    whatsapp: '081234567802',
    kota: 'Cirebon',
    agreeTerms: true,
  });
  await submitAffiliateForm(errorPage);
  await errorPage.waitForTimeout(500);
  const apiError = await affiliateErrorText(errorPage);
  record(
    'Affiliate: submit error message from GAS',
    /Nomor WhatsApp wajib diisi/i.test(apiError),
    apiError.trim()
  );

  // E. End-to-end referral local flow
  const e2ePage = await context.newPage();
  let affiliateRegisterPayload = null;
  let leadPayload = null;

  await mockGasPost(e2ePage, (payload) => {
    if (payload.action === 'registerAffiliate') {
      affiliateRegisterPayload = payload;
      return {
        ...AFFILIATE_SUCCESS_MOCK,
        link_ref: `${BASE_URL}/webinar?ref=BIMA-4821`,
      };
    }
    leadPayload = payload;
    return { success: true, message: 'Lead saved' };
  });

  await clearReferralStorage(e2ePage);
  await gotoAffiliate(e2ePage);
  await fillAffiliateRequired(e2ePage, {
    nama: 'E2E Affiliate E2E',
    whatsapp: '081234567803',
    kota: 'Cirebon',
    agreeTerms: true,
  });
  await submitAffiliateForm(e2ePage);
  await e2ePage.locator('.affiliate-success').waitFor({ state: 'visible', timeout: 5000 });

  await e2ePage.goto(`${BASE_URL}/webinar?ref=BIMA-4821`);
  const badgeText = (await e2ePage.locator('.referral-badge').textContent()) || '';
  record(
    'Affiliate E2E: referral link shows badge',
    /Direkomendasikan oleh\s*BIMA-4821/i.test(badgeText.replace(/\s+/g, ' ').trim()),
    badgeText.trim()
  );

  await fillFormSteps(e2ePage, { nama: 'E2E Affiliate Lead', whatsapp: '081234567804' });
  await e2ePage.getByRole('button', { name: 'Kirim Pendaftaran' }).click();
  await e2ePage.waitForTimeout(1500);

  record(
    'Affiliate E2E: affiliate register captured',
    affiliateRegisterPayload?.action === 'registerAffiliate',
    `action=${affiliateRegisterPayload?.action ?? '(missing)'}`
  );
  record(
    'Affiliate E2E: lead submit includes ref_code',
    leadPayload?.ref_code === 'BIMA-4821',
    `ref_code=${leadPayload?.ref_code ?? '(missing)'}`
  );
}

async function testReferralTracking(context) {
  log('\n=== Referral Tracking Tests ===');

  const badge = (page) => page.locator('.referral-badge');

  // No ref + empty storage → no badge
  const noRefPage = await context.newPage();
  await clearReferralStorage(noRefPage);
  await noRefPage.goto(`${BASE_URL}/webinar`);
  const noBadgeVisible = await badge(noRefPage).isVisible().catch(() => false);
  record('Referral: no ref no badge', !noBadgeVisible);

  // ?ref=BIMA-4821 → badge visible
  const refPage = await context.newPage();
  await clearReferralStorage(refPage);
  await refPage.goto(`${BASE_URL}/webinar?ref=BIMA-4821`);
  const refBadgeText = (await badge(refPage).textContent()) || '';
  record(
    'Referral: ?ref=BIMA-4821 badge visible',
    /Direkomendasikan oleh\s*BIMA-4821/i.test(refBadgeText.replace(/\s+/g, ' ').trim()),
    refBadgeText.trim()
  );

  // Reload without query → badge persists from localStorage
  await refPage.goto(`${BASE_URL}/webinar`);
  const persistedText = (await badge(refPage).textContent()) || '';
  const storedCode = await refPage.evaluate(() => localStorage.getItem('tekad_ref_code'));
  record(
    'Referral: reload without query persists',
    /BIMA-4821/i.test(persistedText) && storedCode === 'BIMA-4821',
    `badge="${persistedText.trim()}", stored=${storedCode}`
  );

  // Malicious ref → sanitized safe (no angle brackets), invalid chars → DIRECT
  const scriptPage = await context.newPage();
  await clearReferralStorage(scriptPage);
  await scriptPage.goto(`${BASE_URL}/webinar?ref=%3Cscript%3E`);
  const scriptBadgeVisible = await badge(scriptPage).isVisible().catch(() => false);
  const scriptBadgeText = scriptBadgeVisible ? (await badge(scriptPage).textContent()) || '' : '';
  const scriptStored = await scriptPage.evaluate(() => localStorage.getItem('tekad_ref_code'));
  record(
    'Referral: script ref sanitized safe',
    !scriptBadgeText.includes('<') &&
      !scriptBadgeText.includes('>') &&
      (scriptStored === null || !String(scriptStored).includes('<')),
    `badge=${scriptBadgeVisible}, stored=${scriptStored}`
  );

  const invalidPage = await context.newPage();
  await clearReferralStorage(invalidPage);
  await invalidPage.goto(`${BASE_URL}/webinar?ref=%3C%3E`);
  const invalidBadge = await badge(invalidPage).isVisible().catch(() => false);
  record('Referral: invalid ref becomes DIRECT', !invalidBadge);

  // Mock GAS: submit from referral link includes ref_code
  const payloadPage = await context.newPage();
  let capturedPayload = null;
  await payloadPage.route(GAS_URL, async (route) => {
    if (route.request().method() === 'POST') {
      try {
        capturedPayload = JSON.parse(route.request().postData() || '{}');
      } catch {
        capturedPayload = null;
      }
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: JSON.stringify({ success: true, message: 'Lead saved' }),
      });
      return;
    }
    await route.continue();
  });

  await clearReferralStorage(payloadPage);
  await payloadPage.goto(`${BASE_URL}/webinar?ref=BIMA-4821`);
  await fillFormSteps(payloadPage, { nama: 'E2E Ref Payload', whatsapp: '081999999901' });
  await payloadPage.getByRole('button', { name: 'Kirim Pendaftaran' }).click();
  await payloadPage.waitForTimeout(1500);
  record(
    'Referral: submit payload includes ref_code',
    capturedPayload?.ref_code === 'BIMA-4821',
    `ref_code=${capturedPayload?.ref_code ?? '(missing)'}`
  );

  // Mock GAS: direct visit sends DIRECT
  const directPayloadPage = await context.newPage();
  let directPayload = null;
  await directPayloadPage.route(GAS_URL, async (route) => {
    if (route.request().method() === 'POST') {
      try {
        directPayload = JSON.parse(route.request().postData() || '{}');
      } catch {
        directPayload = null;
      }
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: JSON.stringify({ success: true, message: 'Lead saved' }),
      });
      return;
    }
    await route.continue();
  });

  await clearReferralStorage(directPayloadPage);
  await directPayloadPage.goto(`${BASE_URL}/`);
  await fillFormSteps(directPayloadPage, { nama: 'E2E Direct Ref', whatsapp: '081999999902' });
  await directPayloadPage.getByRole('button', { name: 'Kirim Pendaftaran' }).click();
  await directPayloadPage.waitForTimeout(1500);
  record(
    'Referral: no ref payload DIRECT',
    directPayload?.ref_code === 'DIRECT',
    `ref_code=${directPayload?.ref_code ?? '(missing)'}`
  );
}

async function testBrowserBackPreservesData(page) {
  log('\n=== Browser Back Preserves Data ===');
  await page.goto(BASE_URL);
  await openForm(page);
  await form(page).getByRole('button', { name: 'Mulai Daftar' }).click();
  await form(page).getByPlaceholder('Contoh: Ibu Siti / Bapak Ahmad').fill('E2E Back Test');
  await form(page).getByRole('button', { name: 'Lanjut' }).click();
  await form(page).getByPlaceholder('08xxxxxxxxxx').fill('081111111188');
  await form(page).getByRole('button', { name: 'Lanjut' }).click();
  await form(page).getByRole('button', { name: 'Kembali' }).click();
  const val = await form(page).getByPlaceholder('08xxxxxxxxxx').inputValue();
  record('Back preserves WhatsApp answer', val === '081111111188', `value=${val}`);
  await form(page).getByRole('button', { name: 'Tutup form' }).click();
}

async function main() {
  log(`E2E Base URL: ${BASE_URL}`);
  log(`GAS URL configured: ${GAS_URL ? 'yes' : 'no'}`);

  // GAS health check
  const health = await fetch(GAS_URL).then((r) => r.json()).catch((e) => ({ success: false, message: String(e) }));
  record('GAS doGet health check', health.success === true, health.message);

  const gasSamples = await testGasDirect();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await testBrowserValidation(page);

    // Browser submit: direct
    const b1 = await testBrowserSubmitWithRedirect(page, '', {
      nama: 'E2E Browser Direct',
      whatsapp: '081222222201',
    });
    record(
      'Browser submit direct + redirect',
      b1.submitOk &&
        b1.capturedPayload?.source === 'direct' &&
        b1.capturedPayload?.ref_code === 'DIRECT',
      `redirect=${b1.redirected}, source=${b1.capturedPayload?.source}, ref_code=${b1.capturedPayload?.ref_code}, url=${b1.finalUrl.slice(0, 80)}`
    );

    // Browser submit: wa_status
    const b2 = await testBrowserSubmitWithRedirect(await context.newPage(), 'source=wa_status', {
      nama: 'E2E Browser WA Status',
      whatsapp: '081222222202',
    });
    record(
      'Browser submit ?source=wa_status + redirect',
      b2.submitOk && b2.capturedPayload?.source === 'wa_status',
      `redirect=${b2.redirected}, source=${b2.capturedPayload?.source}`
    );

    // Browser submit: UTM
    const b3 = await testBrowserSubmitWithRedirect(
      await context.newPage(),
      'utm_source=facebook&utm_medium=organic&utm_campaign=webinar_siap_kerja',
      { nama: 'E2E Browser UTM', whatsapp: '081222222203' }
    );
    record(
      'Browser submit UTM + redirect',
      b3.submitOk &&
        b3.capturedPayload?.utm_source === 'facebook' &&
        b3.capturedPayload?.utm_campaign === 'webinar_siap_kerja',
      `redirect=${b3.redirected}, utm=${b3.capturedPayload?.utm_source}/${b3.capturedPayload?.utm_medium}/${b3.capturedPayload?.utm_campaign}`
    );

    // Browser submit: WA 08
    const b4 = await testBrowserSubmitWithRedirect(await context.newPage(), '', {
      nama: 'E2E Browser WA08',
      whatsapp: '081234567806',
    });
    record(
      'Browser submit WA 08 + redirect',
      b4.submitOk && b4.capturedPayload?.whatsapp_normalized === '6281234567806',
      `redirect=${b4.redirected}, normalized=${b4.capturedPayload?.whatsapp_normalized}`
    );

    // Browser submit: WA +628
    const b5 = await testBrowserSubmitWithRedirect(await context.newPage(), '', {
      nama: 'E2E Browser WA+628',
      whatsapp: '+6281234567807',
    });
    record(
      'Browser submit WA +628 + redirect',
      b5.submitOk && b5.capturedPayload?.whatsapp_normalized === '6281234567807',
      `redirect=${b5.redirected}, normalized=${b5.capturedPayload?.whatsapp_normalized}`
    );

    await testReferralTracking(context);
    await testAffiliatePage(context);
    await testBrowserWrongToken(await context.newPage());
    await testBrowserBackPreservesData(await context.newPage());
    await testMobileLandingOverflow(await context.newPage());
    await testMobileFormLayout(await context.newPage());
  } finally {
    await browser.close();
  }

  log('\n=== SUMMARY ===');
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  log(`Total: ${results.length} | PASS: ${passed} | FAIL: ${failed}`);

  log('\n=== Sample data sent to Sheet (verify manually in Leads tab) ===');
  for (const s of gasSamples.samples) {
    log(`- ${s.name} | source=${s.source || 'direct'} | wa_normalized=${s.wa} | follow_up_status=new | notes=(empty)`);
  }

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('E2E fatal error:', err);
  process.exit(1);
});