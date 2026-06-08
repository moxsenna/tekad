# Setup Google Apps Script & Google Sheet

Backend TEKAD mendukung:

- **Lead webinar** (format lama, backward compatible)
- **Lead webinar + referral** (`ref_code` opsional)
- **Pendaftaran affiliate** (`action: registerAffiliate`)

---

## 1. Buat Google Sheet

Buat spreadsheet: **Database Webinar TEKAD - Dari Bingung Arah Menjadi Siap Kerja**

Buat **3 tab**:

### Tab `Leads` (existing + kolom baru)

Header minimal (Apps Script akan melengkapi kolom yang belum ada):

| Kolom | Keterangan |
|-------|------------|
| submitted_at | ISO timestamp |
| nama_orang_tua | Nama orang tua |
| whatsapp | Nomor WA asli |
| whatsapp_normalized | Format 62xxx |
| status_anak | Status anak |
| kondisi_anak | Kondisi anak |
| kekhawatiran_utama | Opsional |
| kota | Kota |
| bersedia_konsultasi | Ya/Tidak |
| source | direct / wa_status / dll |
| utm_source | UTM |
| utm_medium | UTM |
| utm_campaign | UTM |
| page_url | URL halaman |
| user_agent | Browser UA |
| follow_up_status | Default: `new` |
| notes | Catatan admin |
| **ref_code** | **Baru** — `DIRECT` atau kode affiliate |
| **affiliate_name** | **Baru** — nama affiliate hasil lookup |

> Jika sheet `Leads` production sudah punya 17 kolom lama, deploy script baru akan **menambah** `ref_code` dan `affiliate_name` di kolom R–S tanpa menghapus data lama.

### Tab `affiliates` (baru)

| Kolom | Keterangan |
|-------|------------|
| affiliate_id | Contoh: `AFF-20260608-ABC123` |
| tanggal_daftar | ISO timestamp |
| nama | Nama lengkap affiliate |
| whatsapp | Nomor WA |
| email | Opsional |
| kota | Kota |
| profesi | Opsional |
| media_sosial | Opsional |
| rekening | Opsional |
| nama_rekening | Opsional |
| kode_ref | Contoh: `BIMA-4821` |
| link_ref | URL webinar + `?ref=` |
| status | Default: `active` |
| catatan_admin | Catatan manual admin |

### Tab `settings` (baru)

| key | value |
|-----|-------|
| base_webinar_url | `https://your-domain.pages.dev/webinar` |
| whatsapp_redirect_number | `628xxxxxxxxxx` |
| default_commission | `500000` |
| affiliate_status_default | `active` |

> Jika tab `settings` kosong, script memakai fallback internal. Isi `base_webinar_url` production sebelum go-live affiliate.

---

## 2. Deploy Apps Script

1. Di Google Sheet: **Extensions → Apps Script**
2. Hapus kode default, paste isi `Code.gs` dari repo
3. **Project Settings** (ikon gear) → **Script Properties**
4. Tambahkan property:

| Key | Value |
|-----|-------|
| `FORM_TOKEN` | Token rahasia — sama dengan `VITE_FORM_TOKEN` di frontend |

5. **Deploy → New deployment**
6. Type: **Web app**
7. Execute as: **Me**
8. Who has access: **Anyone**
9. Klik **Deploy** → salin **Web App URL**

Setiap update kode: **Deploy → Manage deployments → Edit → New version → Deploy**.

---

## 3. Environment Frontend

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
VITE_WHATSAPP_REDIRECT_URL=https://wa.me/628XXXXXXXXXX?text=...
VITE_FORM_TOKEN=your-secret-token-here
```

---

## 4. Endpoint & Actions

**POST** ke Web App URL dengan body JSON.

### 4.1 Lead webinar (legacy — tanpa `action`)

Digunakan frontend existing. Response format **tidak berubah**:

```json
{ "success": true, "message": "Lead saved" }
```

```json
{
  "token": "YOUR_FORM_TOKEN",
  "submitted_at": "2026-06-08T10:00:00.000Z",
  "nama_orang_tua": "Ibu Siti",
  "whatsapp": "081234567890",
  "whatsapp_normalized": "6281234567890",
  "status_anak": "Mahasiswa",
  "kondisi_anak": "Masih bingung arah",
  "kekhawatiran_utama": "",
  "kota": "Cirebon",
  "bersedia_konsultasi": "Ya, saya bersedia",
  "source": "direct",
  "utm_source": "",
  "utm_medium": "",
  "utm_campaign": "",
  "page_url": "https://your-domain.pages.dev/",
  "user_agent": "Mozilla/5.0...",
  "honeypot": ""
}
```

### 4.2 Lead webinar + referral (`action: registerLead` atau legacy + `ref_code`)

Sama seperti legacy, tambahkan `ref_code` opsional:

```json
{
  "action": "registerLead",
  "token": "YOUR_FORM_TOKEN",
  "ref_code": "BIMA-4821",
  "nama_orang_tua": "Ibu Siti",
  "whatsapp": "081234567890",
  "status_anak": "Mahasiswa",
  "kondisi_anak": "Masih bingung arah",
  "kota": "Cirebon",
  "bersedia_konsultasi": "Ya, saya bersedia"
}
```

Perilaku `ref_code`:

| Kondisi | `ref_code` disimpan | `affiliate_name` |
|---------|---------------------|------------------|
| Kosong / tidak ada | `DIRECT` | kosong |
| Valid & affiliate `active` | kode affiliate | nama affiliate |
| Tidak ditemukan | kode tetap disimpan | `UNKNOWN` |

Lead **tidak ditolak** jika kode affiliate tidak ditemukan.

### 4.3 Daftar affiliate (`action: registerAffiliate`)

```json
{
  "action": "registerAffiliate",
  "token": "YOUR_FORM_TOKEN",
  "nama": "Bima Senna",
  "whatsapp": "08123456789",
  "kota": "Cirebon",
  "agree_terms": true,
  "email": "bima@email.com",
  "profesi": "Komunitas Orang Tua",
  "media_sosial": "https://instagram.com/example",
  "rekening": "1234567890",
  "nama_rekening": "Bima Senna"
}
```

Response sukses:

```json
{
  "ok": true,
  "affiliate_id": "AFF-20260608-ABC123",
  "kode_ref": "BIMA-4821",
  "link_ref": "https://your-domain.pages.dev/webinar?ref=BIMA-4821",
  "caption": "Bunda/Ayah, kalau anak sedang bingung arah..."
}
```

Response gagal:

```json
{
  "ok": false,
  "error": "VALIDATION_ERROR",
  "message": "Nomor WhatsApp wajib diisi."
}
```

### 4.4 Health check (GET)

Buka Web App URL di browser:

```json
{
  "success": true,
  "message": "TEKAD Webinar Lead + Affiliate API is running",
  "actions": ["registerLead", "registerAffiliate"]
}
```

---

## 5. Format Kode Affiliate

- Format: `NAMADEPAN-4ANGKA` (contoh: `BIMA-4821`)
- Di-generate otomatis di server (bukan input user)
- Nama depan diambil dari field `nama`, dibersihkan, uppercase
- Jika nama tidak valid → prefix `MITRA`
- Cek duplikat di kolom `kode_ref` sheet `affiliates`
- Retry maksimal 10 kali
- Fallback: suffix tambahan jika masih bentrok

---

## 6. Checklist Deploy

- [ ] Tab `Leads`, `affiliates`, `settings` ada di spreadsheet
- [ ] Header `Leads` lama tidak dihapus; kolom `ref_code` + `affiliate_name` siap
- [ ] `settings.base_webinar_url` diisi URL production
- [ ] Script Property `FORM_TOKEN` diset
- [ ] Deploy Web App (Anyone)
- [ ] GET health check sukses
- [ ] POST lead legacy (tanpa `action`) → baris baru di `Leads`, `ref_code=DIRECT`
- [ ] POST `registerAffiliate` → baris baru di `affiliates`
- [ ] POST lead dengan `ref_code` valid → `affiliate_name` terisi
- [ ] POST lead dengan `ref_code` invalid → lead tetap tersimpan, `affiliate_name=UNKNOWN`
- [ ] Frontend existing masih submit sukses (regression)

---

## 7. Test via curl

Ganti `SCRIPT_URL` dan `TOKEN`:

```bash
# Health check
curl "SCRIPT_URL"

# Lead legacy
curl -X POST "SCRIPT_URL" \
  -H "Content-Type: text/plain" \
  -d '{"token":"TOKEN","nama_orang_tua":"Test","whatsapp":"081234567890","status_anak":"Mahasiswa","kondisi_anak":"Bingung","kota":"Cirebon","bersedia_konsultasi":"Ya"}'

# Register affiliate
curl -X POST "SCRIPT_URL" \
  -H "Content-Type: text/plain" \
  -d '{"action":"registerAffiliate","token":"TOKEN","nama":"Bima Senna","whatsapp":"08123456789","kota":"Cirebon","agree_terms":true}'

# Lead dengan ref
curl -X POST "SCRIPT_URL" \
  -H "Content-Type: text/plain" \
  -d '{"action":"registerLead","token":"TOKEN","ref_code":"BIMA-4821","nama_orang_tua":"Test Ref","whatsapp":"081111111111","status_anak":"Mahasiswa","kondisi_anak":"Bingung","kota":"Cirebon","bersedia_konsultasi":"Ya"}'
```