# Landing Page Webinar TEKAD

Landing page webinar gratis **"Mendampingi Anak Menemukan Arah dan Siap Menghadapi Dunia Kerja"** (tema: *Mendampingi Anak Menyiapkan Masa Depan di Era AI*) untuk LPK TEKAD, dengan program mitra affiliate dan referral tracking.

**Copy utama (hero):**
- Kicker: WEBINAR GRATIS UNTUK ORANG TUA
- Headline: Mendampingi Anak Menemukan Arah dan Siap Menghadapi Dunia Kerja
- Subheadline: Panduan praktis untuk Bapak/Ibu yang ingin membantu anak setelah SMA/SMK/kuliah agar punya arah, skill digital, dan lebih percaya diri menghadapi dunia kerja di era AI.

## Stack

- React + Vite + TypeScript
- CSS biasa (tanpa UI library berat)
- Google Apps Script → Google Sheet
- Hosting: Cloudflare Pages

## Halaman & Route

| Route | Fungsi |
|-------|--------|
| `/` | Landing webinar |
| `/webinar` | Alias landing webinar |
| `/webinar?ref=KODE` | Landing webinar + simpan referral (`tekad_ref_code`) + badge + kirim `ref_code` ke Sheet |
| `/affiliate` | Pendaftaran mitra affiliate + link promosi |

Tanpa `?ref=`, nilai referral default adalah `DIRECT`.

## Menjalankan Lokal

### Prasyarat

- Node.js 18+
- npm

### Langkah

1. Clone repository dan masuk ke folder project:

```bash
cd tekad
```

2. Install dependencies:

```bash
npm install
```

3. Salin environment template:

```bash
cp .env.example .env.local
```

4. Isi `.env.local` dengan nilai yang valid (lihat bagian Environment Variables di bawah).

5. Jalankan dev server:

```bash
npm run dev
```

6. Buka `http://localhost:5173` di browser.

### Build & Test

```bash
npm run build
node scripts/e2e-runtime.mjs
```

E2E membutuhkan dev server berjalan (default `http://localhost:5175`). Override dengan `E2E_BASE_URL` jika perlu.

Preview build lokal:

```bash
npm run preview
```

Output production ada di folder `dist/`.

## Environment Variables

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `VITE_GOOGLE_SCRIPT_URL` | Ya | URL Web App Google Apps Script |
| `VITE_FORM_TOKEN` | Ya | Token rahasia, harus sama dengan `FORM_TOKEN` di Apps Script |
| `VITE_WHATSAPP_REDIRECT_URL` | Ya | URL `wa.me` untuk redirect setelah submit webinar |

**Development:** simpan di `.env.local` (tidak di-commit).

**Production (Cloudflare Pages):** set di Dashboard → Settings → Environment variables.

## Setup Google Sheet & Apps Script

Panduan lengkap: [`google-apps-script/README.md`](google-apps-script/README.md).

Ringkas:

1. Buat Google Sheet dengan tab **Leads** (kolom `ref_code`, `affiliate_name` ditambahkan otomatis oleh script)
2. Siapkan tab **affiliates** dan **settings** (script bisa membuat jika belum ada)
3. Deploy `google-apps-script/Code.gs` sebagai Web App
4. Set Script Property `FORM_TOKEN`
5. Isi `base_webinar_url` di sheet **settings** (URL landing webinar production)
6. Salin Web App URL ke `VITE_GOOGLE_SCRIPT_URL`

## Alur Affiliate MVP

1. Mitra daftar di `/affiliate` → dapat `kode_ref`, `link_ref`, dan caption promosi
2. Mitra share `link_ref` (format `/webinar?ref=KODE`)
3. Pengunjung melihat badge referral di landing
4. Submit form webinar mengirim `ref_code` ke Google Sheet
5. Admin validasi lead & komisi manual (di luar scope frontend)

## Deploy ke Cloudflare Pages

1. Push project ke GitHub
2. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Pilih repository
4. Build settings:
   - **Framework preset:** None (atau Vite jika tersedia)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Tambahkan environment variables:
   - `VITE_GOOGLE_SCRIPT_URL`
   - `VITE_FORM_TOKEN`
   - `VITE_WHATSAPP_REDIRECT_URL`
6. Deploy
7. Uji manual `/`, `/webinar?ref=KODE`, `/affiliate`, dan submit form

File `public/_redirects` (`/* /index.html 200`) memastikan route SPA berfungsi di Cloudflare Pages.

### Custom Domain (opsional)

Di Cloudflare Pages → **Custom domains** → tambahkan domain Anda.

## Tracking Source

Landing page menangkap query parameter:

- `source` (default: `direct`)
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `ref` (affiliate referral, disimpan di `localStorage` key `tekad_ref_code`)

Contoh:

```
https://your-domain.pages.dev/?source=wa_status
https://your-domain.pages.dev/?utm_source=facebook&utm_medium=organic&utm_campaign=webinar_siap_kerja
https://your-domain.pages.dev/webinar?ref=BIMA-4821
```

## Struktur Project

```
src/
  components/
    layout/       Header, Footer
    sections/     Landing page sections
    form/         Typeform-style form
  pages/          WebinarLandingPage, AffiliatePage
  hooks/          useFormState
  lib/            tracking, referral, validation, submitLead, submitAffiliate, routing
  styles/         global, landing, form, affiliate CSS
  types/          TypeScript interfaces
google-apps-script/
  Code.gs         Backend handler untuk Google Sheet + affiliate
public/
  _redirects      SPA fallback untuk Cloudflare Pages
scripts/
  e2e-runtime.mjs Runtime E2E (webinar + affiliate + referral)
```

## Manual Test Checklist

### Webinar

- [ ] Landing page responsif (mobile & desktop)
- [ ] CTA membuka form full-screen
- [ ] Validasi per step berjalan
- [ ] Submit berhasil → data masuk Google Sheet
- [ ] Redirect WhatsApp setelah sukses
- [ ] `?source=wa_status` tercatat di sheet
- [ ] `?ref=KODE` → badge tampil, `ref_code` masuk Sheet
- [ ] Tanpa ref → `ref_code=DIRECT`
- [ ] Tombol Back tidak menghapus jawaban
- [ ] Tombol Close kembali ke landing page

### Affiliate

- [ ] `/affiliate` render di mobile tanpa overflow
- [ ] Validasi form affiliate (nama, WA, kota, persetujuan)
- [ ] Submit berhasil → kode, link, caption tampil
- [ ] Copy Link / Copy Caption berfungsi
- [ ] Link referral membuka webinar dengan badge