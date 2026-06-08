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
      b1.submitOk && b1.capturedPayload?.source === 'direct',
      `redirect=${b1.redirected}, source=${b1.capturedPayload?.source}, url=${b1.finalUrl.slice(0, 80)}`
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

    await testBrowserWrongToken(await context.newPage());
    await testBrowserBackPreservesData(await context.newPage());
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