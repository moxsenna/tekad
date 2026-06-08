# Landing Page Webinar TEKAD

Landing page pendaftaran webinar gratis **"Dari Bingung Arah Menjadi Siap Kerja"** untuk LPK TEKAD.

## Stack

- React + Vite + TypeScript
- CSS biasa (tanpa UI library berat)
- Google Apps Script → Google Sheet
- Hosting: Cloudflare Pages

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

### Build Production

```bash
npm run build
```

Output ada di folder `dist/`.

Preview build lokal:

```bash
npm run preview
```

## Environment Variables

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `VITE_GOOGLE_SCRIPT_URL` | Ya | URL Web App Google Apps Script |
| `VITE_WHATSAPP_REDIRECT_URL` | Ya | URL `wa.me` untuk redirect setelah submit |
| `VITE_FORM_TOKEN` | Ya | Token rahasia, harus sama dengan `FORM_TOKEN` di Apps Script |

**Development:** simpan di `.env.local` (tidak di-commit).

**Production (Cloudflare Pages):** set di Dashboard → Settings → Environment variables.

## Setup Google Sheet & Apps Script

Lihat panduan lengkap di [`google-apps-script/README.md`](google-apps-script/README.md).

Ringkas:

1. Buat Google Sheet dengan tab **Leads**
2. Deploy `google-apps-script/Code.gs` sebagai Web App
3. Set Script Property `FORM_TOKEN`
4. Salin Web App URL ke `VITE_GOOGLE_SCRIPT_URL`

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
   - `VITE_WHATSAPP_REDIRECT_URL`
   - `VITE_FORM_TOKEN`
6. Deploy
7. Test submit form di URL production

### Custom Domain (opsional)

Di Cloudflare Pages → **Custom domains** → tambahkan domain Anda.

## Tracking Source

Landing page menangkap query parameter:

- `source` (default: `direct`)
- `utm_source`
- `utm_medium`
- `utm_campaign`

Contoh:

```
https://your-domain.pages.dev/?source=wa_status
https://your-domain.pages.dev/?utm_source=facebook&utm_medium=organic&utm_campaign=webinar_siap_kerja
```

## Struktur Project

```
src/
  components/
    layout/       Header
    sections/     Landing page sections
    form/         Typeform-style form
  hooks/          useFormState
  lib/            tracking, validation, submit, whatsapp
  styles/         global, landing, form CSS
  types/          TypeScript interfaces
google-apps-script/
  Code.gs         Backend handler untuk Google Sheet
```

## Manual Test Checklist

- [ ] Landing page responsif (mobile & desktop)
- [ ] CTA membuka form full-screen
- [ ] Validasi per step berjalan
- [ ] Submit berhasil → data masuk Google Sheet
- [ ] Redirect WhatsApp setelah sukses
- [ ] `?source=wa_status` tercatat di sheet
- [ ] Tombol Back tidak menghapus jawaban
- [ ] Tombol Close kembali ke landing page