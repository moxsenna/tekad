import {
  buildWhatsAppMessage,
  buildWhatsAppRedirectUrl,
  sanitizeWhatsAppPhone,
} from '../src/lib/whatsapp';
import { WEBINAR_THEME } from '../src/lib/webinarCopy';

const LEGACY_URL =
  'https://api.whatsapp.com/send/?phone=6289999999999&text=legacy&type=phone_number&app_absent=0';

let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`PASS — ${name}${detail ? `: ${detail}` : ''}`);
  } else {
    failed += 1;
    console.log(`FAIL — ${name}${detail ? `: ${detail}` : ''}`);
  }
}

// Test 1 — data lengkap
const fullMessage = buildWhatsAppMessage({
  nama_orang_tua: 'Bima',
  status_anak: 'Baru lulus SMA/SMK',
  kondisi_anak: 'Masih bingung mau kuliah atau kerja',
  kota: 'Cirebon',
});
assert('message: nama pendaftar', fullMessage.includes('saya Bima sudah daftar webinar'));
assert('message: tema webinar', fullMessage.includes(`Tema webinar: ${WEBINAR_THEME}`));
assert('message: status anak', fullMessage.includes('Status: Baru lulus SMA/SMK'));
assert('message: kondisi anak', fullMessage.includes('Kondisi: Masih bingung mau kuliah atau kerja'));
assert('message: domisili', fullMessage.includes('Domisili: Cirebon'));

// Test 2 — kota kosong
const noKotaMessage = buildWhatsAppMessage({
  nama_orang_tua: 'Bima',
  status_anak: 'Baru lulus SMA/SMK',
  kondisi_anak: 'Masih bingung mau kuliah atau kerja',
  kota: '',
});
assert('empty kota: no Domisili line', !noKotaMessage.includes('Domisili:'));
assert('empty kota: no undefined', !noKotaMessage.includes('undefined'));
assert('empty kota: no null', !noKotaMessage.includes('null'));

// Test 3 — nama kosong
const noNameMessage = buildWhatsAppMessage({
  nama_orang_tua: '',
  status_anak: 'Mahasiswa',
  kondisi_anak: '',
  kota: '',
});
assert('empty nama: natural opening', noNameMessage.startsWith('Halo Admin TEKAD, saya sudah daftar webinar.'));
assert('empty nama: no undefined', !noNameMessage.includes('undefined'));
assert('empty nama: no double space', !noNameMessage.includes('  '));

// Test 4 — admin phone tersedia
const dynamicUrl = buildWhatsAppRedirectUrl(
  {
    nama_orang_tua: 'Bima',
    status_anak: 'Baru lulus SMA/SMK',
    kondisi_anak: 'Masih bingung mau kuliah atau kerja',
    kota: 'Cirebon',
  },
  { adminPhone: '6285188438643' }
);
assert('admin phone: uses configured number', dynamicUrl.includes('phone=6285188438643'));

// Test 5 — admin phone kosong, fallback legacy
const fallbackUrl = buildWhatsAppRedirectUrl(
  { nama_orang_tua: 'Bima', status_anak: '', kondisi_anak: '', kota: '' },
  { adminPhone: '', legacyUrl: LEGACY_URL }
);
assert('fallback: uses legacy URL', fallbackUrl === LEGACY_URL);

// Test 7 — encoded URL
assert('encoded: uses encodeURIComponent', dynamicUrl.includes(encodeURIComponent('Halo Admin TEKAD')));
assert('encoded: newline safe', dynamicUrl.includes('%0A'));

// sanitizeWhatsAppPhone
assert('sanitize: strips non-digits', sanitizeWhatsAppPhone('+62 851-8843-8643') === '6285188438643');
assert('sanitize: empty input', sanitizeWhatsAppPhone('') === '');

console.log(`\nWhatsApp helper tests: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);