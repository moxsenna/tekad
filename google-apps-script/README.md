# Setup Google Apps Script & Google Sheet

## 1. Buat Google Sheet

1. Buat spreadsheet baru dengan nama: **Database Webinar TEKAD - Dari Bingung Arah Menjadi Siap Kerja**
2. Buat tab bernama **`Leads`**
3. Tambahkan header kolom di baris 1 (atau biarkan Apps Script mengisi otomatis):

| Kolom | Nama |
|-------|------|
| A | submitted_at |
| B | nama_orang_tua |
| C | whatsapp |
| D | whatsapp_normalized |
| E | status_anak |
| F | kondisi_anak |
| G | kekhawatiran_utama |
| H | kota |
| I | bersedia_konsultasi |
| J | source |
| K | utm_source |
| L | utm_medium |
| M | utm_campaign |
| N | page_url |
| O | user_agent |
| P | follow_up_status |
| Q | notes |

## 2. Deploy Apps Script

1. Di Google Sheet: **Extensions → Apps Script**
2. Hapus kode default, paste isi `Code.gs`
3. Buka **Project Settings** (ikon gear) → **Script Properties**
4. Tambahkan property:
   - Key: `FORM_TOKEN`
   - Value: token rahasia yang sama dengan `VITE_FORM_TOKEN` di frontend
5. Klik **Deploy → New deployment**
6. Type: **Web app**
7. Execute as: **Me**
8. Who has access: **Anyone**
9. Klik **Deploy** dan salin **Web App URL**

## 3. Masukkan URL ke Environment

Salin Web App URL ke:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
```

## 4. Test

Buka URL Web App di browser — harus menampilkan JSON:

```json
{ "success": true, "message": "TEKAD Webinar Lead API is running" }
```

Lalu test submit dari landing page dan cek baris baru di sheet **Leads**.