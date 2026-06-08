# TEKAD Affiliate MVP Plan

> Dokumen ini adalah rencana implementasi fitur affiliate/referral MVP untuk landing page webinar TEKAD.  
> Target stack awal: **Cloudflare Pages + Google Apps Script + Google Sheet**.  
> Tidak menggunakan Cloudflare Worker, Supabase, login affiliate, atau payout otomatis pada fase MVP.

---

## 1. Tujuan

Membuat sistem affiliate sederhana agar:

1. Affiliate bisa daftar melalui halaman `/affiliate`.
2. Sistem otomatis membuat kode affiliate unik.
3. Affiliate langsung mendapat link promosi pribadi.
4. Affiliate membagikan link webinar/landing page.
5. Lead yang masuk dari link tersebut otomatis tercatat dengan `ref_code`.
6. Admin bisa melihat affiliate mana yang menghasilkan lead dan closing.
7. Komisi dibayar manual setelah validasi admin.

Flow utama:

```text
Affiliate daftar
↓
Sistem buat kode unik
↓
Affiliate dapat link promosi
↓
Affiliate share link
↓
Calon peserta/orang tua isi form webinar
↓
Lead masuk Google Sheet dengan ref_code
↓
Admin follow-up
↓
Jika lead jadi peserta bayar, admin catat komisi
↓
Komisi dibayar manual
```

---

## 2. Prinsip MVP

Fitur ini harus dibuat sederhana, cepat, dan mudah diverifikasi.

### Yang dibuat di MVP

- Halaman daftar affiliate: `/affiliate`
- Form pendaftaran affiliate
- Generate kode affiliate otomatis
- Validasi agar kode affiliate tidak duplikat
- Simpan data affiliate ke Google Sheet
- Tampilkan link affiliate setelah submit
- Tombol copy link affiliate
- Tombol copy caption promosi
- Landing webinar membaca parameter `?ref=...`
- Form webinar menyimpan `ref_code`
- Data lead masuk Google Sheet
- Redirect ke WhatsApp setelah form webinar submit
- Admin tracking affiliate dan komisi secara manual di Google Sheet

### Yang tidak dibuat di MVP

- Login affiliate
- Dashboard affiliate
- Payout otomatis
- Tracking klik detail
- Sistem komisi otomatis
- Integrasi payment otomatis
- Anti-fraud kompleks
- Cloudflare Worker
- Supabase database
- Multi-level affiliate
- Kupon affiliate

---

## 3. Arsitektur Teknis

```text
Cloudflare Pages
├── /affiliate
│   ├── Form daftar affiliate
│   ├── Submit ke Google Apps Script
│   └── Tampilkan link unik + tombol copy
│
├── /webinar
│   ├── Baca ?ref=KODE
│   ├── Simpan ref ke localStorage
│   ├── Form daftar webinar
│   ├── Submit lead ke Google Apps Script
│   └── Redirect ke WhatsApp
│
└── Google Apps Script
    ├── Endpoint registerAffiliate
    ├── Endpoint registerLead
    ├── Generate kode affiliate
    ├── Cek duplikat kode
    ├── Lookup affiliate dari ref_code
    └── Simpan ke Google Sheet
```

Stack:

```text
Frontend       : Cloudflare Pages, HTML, CSS, JavaScript
Form Backend   : Google Apps Script Web App
Database MVP   : Google Sheet
Admin Workflow : Manual via Google Sheet
```

---

## 4. Struktur Halaman

### 4.1 Halaman `/affiliate`

Fungsi:

- Menjelaskan program affiliate TEKAD.
- Menampilkan cara kerja affiliate.
- Menampilkan form daftar affiliate.
- Setelah submit, menampilkan kode dan link affiliate.

Section halaman:

1. Hero
2. Benefit affiliate
3. Cara kerja
4. Aturan affiliate
5. Form pendaftaran
6. Success card setelah submit

Contoh headline:

```text
Jadi Mitra Affiliate TEKAD
```

Contoh subheadline:

```text
Bantu orang tua menemukan jalur keterampilan digital dan AI untuk anaknya, lalu dapatkan komisi untuk setiap peserta yang berhasil mendaftar melalui link Anda.
```

CTA:

```text
Daftar & Buat Link Affiliate
```

---

### 4.2 Halaman `/webinar`

Fungsi:

- Landing page webinar atau lead magnet.
- Membaca kode affiliate dari URL.
- Menyimpan kode affiliate ke localStorage.
- Mengirim data lead beserta `ref_code` ke Google Sheet.
- Redirect ke WhatsApp setelah submit.

Contoh URL affiliate:

```text
https://domaintekad.com/webinar?ref=BIMA-4821
```

Behavior:

```text
User membuka /webinar?ref=BIMA-4821
↓
Frontend membaca ref = BIMA-4821
↓
Simpan ke localStorage: tekad_ref_code = BIMA-4821
↓
Tampilkan badge kecil: "Direkomendasikan oleh BIMA-4821"
↓
User isi form webinar
↓
Submit data + ref_code ke Google Apps Script
↓
Redirect ke WhatsApp
```

Kalau tidak ada `ref`, sistem menyimpan:

```text
DIRECT
```

---

## 5. Format Kode Affiliate

Gunakan format:

```text
NAMADEPAN-4ANGKA
```

Contoh:

```text
BIMA-4821
ALIF-7392
AGIS-1064
FITRI-2258
```

Catatan:

- Tidak wajib pakai prefix `TEKAD`.
- Kode tanpa `TEKAD` aman untuk MVP.
- Jangan izinkan user mengetik kode sendiri pada MVP.
- Kode dibuat otomatis oleh Google Apps Script.
- Sistem wajib mengecek duplikat sebelum menyimpan.

Format ini dipilih karena:

- Mudah dibaca.
- Mudah dicopy.
- Personal untuk affiliate.
- Risiko duplikat rendah.
- Tetap profesional tanpa terlalu panjang.

---

## 6. Anti-Duplikat Kode Affiliate

Kode affiliate harus dicek ke Google Sheet sebelum disimpan.

Flow:

```text
Terima data affiliate
↓
Ambil nama depan dari field nama
↓
Bersihkan karakter aneh
↓
Ubah ke uppercase
↓
Generate angka random 4 digit
↓
Bentuk kode: BIMA-4821
↓
Cek kolom kode_ref di sheet affiliates
↓
Jika kode sudah ada, generate ulang angka
↓
Cek lagi
↓
Jika kode belum ada, simpan affiliate
↓
Return kode_ref dan link_ref ke frontend
```

Batas retry:

```text
10 kali
```

Fallback jika 10 kali gagal:

```text
BIMA-4821-7
```

Kemungkinan fallback terpakai sangat kecil, tetapi tetap disiapkan.

---

## 7. Struktur Google Sheet

Buat satu Google Spreadsheet dengan minimal 3 sheet:

1. `affiliates`
2. `leads`
3. `settings`

---

### 7.1 Sheet `affiliates`

| Kolom | Tipe | Keterangan |
|---|---|---|
| affiliate_id | string | ID unik affiliate |
| tanggal_daftar | timestamp | Waktu submit |
| nama | string | Nama lengkap affiliate |
| whatsapp | string | Nomor WhatsApp affiliate |
| email | string | Email affiliate |
| kota | string | Kota affiliate |
| profesi | string | Profesi/komunitas |
| media_sosial | string | Link IG/TikTok/FB |
| rekening | string | Nomor rekening/e-wallet |
| nama_rekening | string | Nama pemilik rekening |
| kode_ref | string | Contoh: BIMA-4821 |
| link_ref | string | Link webinar dengan ref |
| status | string | active / inactive |
| catatan_admin | string | Catatan manual admin |

Status default:

```text
active
```

---

### 7.2 Sheet `leads`

| Kolom | Tipe | Keterangan |
|---|---|---|
| lead_id | string | ID unik lead |
| tanggal_daftar | timestamp | Waktu submit |
| nama_lead | string | Nama calon peserta/orang tua |
| whatsapp | string | Nomor WA lead |
| kota | string | Kota lead |
| status_anak | string | Lulus SMA / mahasiswa / fresh graduate / lainnya |
| minat | string | Siap kerja / digital marketing / AI / wirausaha |
| sumber | string | webinar |
| ref_code | string | Kode affiliate |
| affiliate_name | string | Nama affiliate hasil lookup |
| status_lead | string | new / contacted / attended / hot / cold |
| status_bayar | string | unpaid / dp / paid |
| nominal_bayar | number | Diisi manual admin |
| komisi | number | Diisi manual admin |
| payout_status | string | unpaid / paid |
| catatan_admin | string | Catatan follow-up |

Default:

```text
status_lead   = new
status_bayar  = unpaid
payout_status = unpaid
```

---

### 7.3 Sheet `settings`

| key | value |
|---|---|
| base_webinar_url | https://domaintekad.com/webinar |
| whatsapp_redirect_number | 628xxxxxxxxxx |
| default_commission | 500000 |
| affiliate_status_default | active |

---

## 8. Form Pendaftaran Affiliate

### Field form

Wajib:

- Nama lengkap
- WhatsApp
- Kota
- Persetujuan syarat affiliate

Opsional:

- Email
- Profesi/komunitas
- Akun media sosial
- Nomor rekening/e-wallet
- Nama pemilik rekening

### Validasi

Nama:

- minimal 2 karakter
- tidak boleh kosong

WhatsApp:

- hanya angka, spasi, tanda `+`, dan `-`
- normalisasi `08xxx` menjadi `628xxx`
- minimal 10 digit
- maksimal 15 digit

Persetujuan:

- checkbox wajib dicentang

---

## 9. Form Webinar / Lead

### Field form

Wajib:

- Nama calon peserta/orang tua
- WhatsApp
- Kota
- Status anak
- Minat utama

Opsional:

- Catatan tambahan
- Umur anak
- Kendala utama

### Data tersembunyi yang ikut dikirim

- `ref_code`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `landing_url`
- `user_agent`
- `timestamp`

---

## 10. Google Apps Script Endpoint

Deploy Google Apps Script sebagai Web App.

Endpoint tunggal:

```text
POST https://script.google.com/macros/s/XXXXX/exec
```

Request dibedakan dengan field `action`.

### 10.1 Register affiliate

Request:

```json
{
  "action": "registerAffiliate",
  "nama": "Bima Senna",
  "whatsapp": "08123456789",
  "email": "bima@email.com",
  "kota": "Cirebon",
  "profesi": "Komunitas Orang Tua",
  "media_sosial": "https://instagram.com/example",
  "rekening": "1234567890",
  "nama_rekening": "Bima Senna",
  "agree_terms": true
}
```

Response sukses:

```json
{
  "ok": true,
  "affiliate_id": "AFF-20260608-ABC123",
  "kode_ref": "BIMA-4821",
  "link_ref": "https://domaintekad.com/webinar?ref=BIMA-4821",
  "caption": "..."
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

---

### 10.2 Register lead

Request:

```json
{
  "action": "registerLead",
  "nama_lead": "Ibu Siti",
  "whatsapp": "08123456789",
  "kota": "Cirebon",
  "status_anak": "Lulus SMA",
  "minat": "Skill digital dan AI",
  "ref_code": "BIMA-4821",
  "utm_source": "affiliate",
  "utm_medium": "referral",
  "utm_campaign": "webinar_siap_kerja"
}
```

Response sukses:

```json
{
  "ok": true,
  "lead_id": "LEAD-20260608-XYZ789",
  "ref_code": "BIMA-4821",
  "affiliate_name": "Bima Senna",
  "redirect_url": "https://wa.me/628xxxxxxxxxx?text=..."
}
```

Response gagal:

```json
{
  "ok": false,
  "error": "VALIDATION_ERROR",
  "message": "Nama dan WhatsApp wajib diisi."
}
```

---

## 11. Frontend Behavior: `/affiliate`

### Submit state

Saat tombol submit diklik:

```text
Disable tombol
Tampilkan loading
Kirim data ke Apps Script
Jika sukses:
  tampilkan success card
  tampilkan kode affiliate
  tampilkan link affiliate
  tampilkan tombol copy link
  tampilkan tombol copy caption
Jika gagal:
  tampilkan pesan error
Enable tombol kembali
```

### Success card

Tampilkan:

```text
Pendaftaran Berhasil

Kode Affiliate Anda:
BIMA-4821

Link Promosi Anda:
https://domaintekad.com/webinar?ref=BIMA-4821

[Copy Link]
[Copy Caption Promosi]
[Share ke WhatsApp]
```

---

## 12. Frontend Behavior: `/webinar`

Saat page load:

```text
Ambil ref dari URLSearchParams
Jika ada ref:
  simpan ke localStorage "tekad_ref_code"
Jika tidak ada ref:
  cek localStorage
Jika tetap tidak ada:
  gunakan "DIRECT"
```

Saat form submit:

```text
Ambil ref_code dari state/localStorage
Kirim data lead + ref_code ke Apps Script
Jika sukses:
  redirect ke WhatsApp
Jika gagal:
  tampilkan error
```

Badge referral:

```text
Direkomendasikan oleh BIMA-4821
```

Badge hanya ditampilkan jika `ref_code !== DIRECT`.

---

## 13. Caption Promosi Affiliate

Setelah affiliate daftar, sistem menampilkan caption siap copy.

Template:

```text
Bunda/Ayah, kalau anak sedang bingung arah setelah lulus sekolah atau belum siap masuk dunia kerja, TEKAD mengadakan webinar gratis:

"Dari Bingung Arah Menjadi Siap Kerja"

Di webinar ini akan dibahas bagaimana anak bisa mulai membangun skill digital, AI, portofolio, dan kesiapan kerja tanpa harus bingung mulai dari mana.

Daftar gratis di sini:
{{link_ref}}
```

Placeholder:

```text
{{link_ref}} = link affiliate masing-masing
```

---

## 14. Aturan Affiliate

Tampilkan checkbox persetujuan di form affiliate:

```text
Saya memahami bahwa:
1. Komisi hanya diberikan untuk peserta yang benar-benar membayar.
2. Data lead akan diverifikasi oleh admin TEKAD.
3. Dilarang menggunakan klaim berlebihan atau menyesatkan.
4. Dilarang menjanjikan pekerjaan instan.
5. Pembayaran komisi dilakukan manual sesuai jadwal TEKAD.
```

### Klaim yang dilarang

Affiliate tidak boleh menggunakan klaim seperti:

```text
Pasti kerja setelah ikut program.
Pasti dapat gaji besar.
Pasti langsung jadi AI expert.
Pasti sukses dalam 3 bulan.
```

### Klaim yang aman

Affiliate boleh menggunakan klaim seperti:

```text
Membantu anak lebih siap kerja.
Membantu membangun skill digital dan AI.
Membantu membuat portofolio nyata.
Membuka peluang karier, freelance, atau wirausaha digital.
```

---

## 15. Admin Workflow

Admin menggunakan Google Sheet sebagai dashboard manual.

### Setiap hari

1. Buka sheet `affiliates`.
2. Cek affiliate baru.
3. Validasi nomor WhatsApp.
4. Hubungi affiliate jika perlu.
5. Kirim materi promosi.
6. Pastikan status affiliate `active`.

### Follow-up lead

1. Buka sheet `leads`.
2. Filter `status_lead = new`.
3. Hubungi lead via WhatsApp.
4. Update status lead:
   - `contacted`
   - `attended`
   - `hot`
   - `cold`

### Saat lead bayar

1. Cari lead.
2. Ubah `status_bayar = paid`.
3. Isi `nominal_bayar`.
4. Isi `komisi`.
5. Pastikan `payout_status = unpaid`.

### Saat komisi dibayar

1. Transfer manual.
2. Ubah `payout_status = paid`.
3. Tambahkan catatan pembayaran di `catatan_admin`.

---

## 16. Komisi Awal yang Disarankan

Karena program TEKAD bernilai tinggi, komisi bisa menarik tetapi tetap aman untuk cashflow.

Rekomendasi MVP:

```text
Komisi standar: Rp500.000 per peserta lunas
```

Opsional bonus:

```text
Jika affiliate menghasilkan 5 peserta lunas:
Bonus tambahan Rp500.000
```

Jangan bayar komisi hanya berdasarkan lead pada fase awal, kecuali ada sistem validasi kehadiran yang rapi.

---

## 17. Testing Checklist

### Affiliate registration

- [ ] Affiliate bisa membuka `/affiliate`.
- [ ] Form tidak bisa submit jika nama kosong.
- [ ] Form tidak bisa submit jika WhatsApp kosong.
- [ ] Form tidak bisa submit jika checkbox persetujuan belum dicentang.
- [ ] Nomor `08xxx` dinormalisasi menjadi `628xxx`.
- [ ] Submit sukses menyimpan data ke sheet `affiliates`.
- [ ] Sistem membuat `kode_ref`.
- [ ] Sistem membuat `link_ref`.
- [ ] Success card menampilkan kode dan link.
- [ ] Tombol copy link berjalan.
- [ ] Tombol copy caption berjalan.

### Anti-duplicate

- [ ] Jika kode hasil generate sudah ada, sistem generate ulang.
- [ ] Tidak ada dua affiliate dengan `kode_ref` sama.
- [ ] Kode tetap terbentuk walau nama mengandung spasi/simbol.

### Webinar lead

- [ ] `/webinar?ref=BIMA-4821` membaca ref dengan benar.
- [ ] Ref tersimpan di localStorage.
- [ ] Badge referral tampil.
- [ ] Form webinar submit sukses.
- [ ] Data lead masuk sheet `leads`.
- [ ] Kolom `ref_code` terisi benar.
- [ ] Kolom `affiliate_name` terisi dari lookup.
- [ ] Jika tanpa ref, `ref_code = DIRECT`.
- [ ] Setelah submit, user redirect ke WhatsApp.

### Admin

- [ ] Admin bisa filter lead berdasarkan `ref_code`.
- [ ] Admin bisa update `status_lead`.
- [ ] Admin bisa update `status_bayar`.
- [ ] Admin bisa isi `komisi`.
- [ ] Admin bisa update `payout_status`.

---

## 18. Milestone Implementasi

### Phase 1 — Google Sheet Setup

- [ ] Buat Google Spreadsheet.
- [ ] Buat sheet `affiliates`.
- [ ] Buat sheet `leads`.
- [ ] Buat sheet `settings`.
- [ ] Tambahkan header kolom.
- [ ] Isi settings dasar.

### Phase 2 — Google Apps Script

- [ ] Buat Apps Script.
- [ ] Buat handler `doPost(e)`.
- [ ] Buat action `registerAffiliate`.
- [ ] Buat action `registerLead`.
- [ ] Buat fungsi normalisasi WhatsApp.
- [ ] Buat fungsi generate kode affiliate.
- [ ] Buat fungsi cek kode duplikat.
- [ ] Buat fungsi lookup affiliate by `ref_code`.
- [ ] Deploy sebagai Web App.
- [ ] Test via Postman/curl/browser.

### Phase 3 — Frontend `/affiliate`

- [ ] Buat halaman affiliate.
- [ ] Buat form.
- [ ] Integrasi submit ke Apps Script.
- [ ] Buat loading state.
- [ ] Buat error state.
- [ ] Buat success card.
- [ ] Buat copy link button.
- [ ] Buat copy caption button.
- [ ] Buat share WhatsApp button.

### Phase 4 — Frontend `/webinar`

- [ ] Baca parameter `?ref=`.
- [ ] Simpan ref ke localStorage.
- [ ] Tampilkan badge referral.
- [ ] Tambahkan form webinar.
- [ ] Submit lead ke Apps Script.
- [ ] Redirect ke WhatsApp.
- [ ] Handle mode tanpa referral.

### Phase 5 — QA

- [ ] Test affiliate registration.
- [ ] Test duplicate prevention.
- [ ] Test webinar with ref.
- [ ] Test webinar without ref.
- [ ] Test Google Sheet data.
- [ ] Test redirect WhatsApp.
- [ ] Test admin filtering.
- [ ] Test mobile layout.

---

## 19. Acceptance Criteria

Fitur dianggap selesai jika:

1. Affiliate bisa daftar dari `/affiliate`.
2. Affiliate langsung mendapat kode dan link unik.
3. Kode affiliate tidak duplikat.
4. Link affiliate bisa dicopy.
5. Caption promosi bisa dicopy.
6. Link `/webinar?ref=KODE` terbaca dengan benar.
7. Lead yang submit dari link affiliate tercatat dengan `ref_code`.
8. Lead tanpa referral tercatat sebagai `DIRECT`.
9. Admin bisa melihat lead per affiliate di Google Sheet.
10. Admin bisa mencatat status bayar dan komisi manual.
11. Tidak ada klaim berlebihan pada copy affiliate.
12. Semua form berjalan baik di mobile.

---

## 20. Upgrade Setelah MVP Valid

Jika affiliate mulai menghasilkan closing, upgrade berikutnya:

```text
Cloudflare Worker
Supabase
Affiliate login
Affiliate dashboard
Click tracking
Lead tracking dashboard
Payout report
Admin approval
Payment integration
Fraud prevention
```

Tahapan upgrade:

1. Simpan data affiliate dan lead ke Supabase.
2. Tambah login affiliate.
3. Tambah dashboard affiliate.
4. Tambah tracking klik.
5. Tambah status closing yang lebih rapi.
6. Tambah laporan komisi.
7. Tambah export payout.
8. Baru pertimbangkan payout otomatis.

---

## 21. Instruksi untuk Agent

Implementasikan MVP secara bertahap. Jangan menambah Cloudflare Worker atau Supabase pada fase ini kecuali diminta ulang.

Prioritas:

1. Buat Google Sheet schema.
2. Buat Google Apps Script yang robust.
3. Buat halaman `/affiliate`.
4. Integrasikan `/webinar` dengan referral.
5. Pastikan semua data masuk sheet dengan rapi.
6. Pastikan admin bisa tracking manual.

Jangan membuat:

- dashboard login affiliate
- sistem payout otomatis
- multi-level affiliate
- payment integration
- backend Worker
- database Supabase

Semua logic sensitif seperti generate kode dan cek duplikat harus dilakukan di Google Apps Script, bukan hanya di frontend.

---

## 22. Ringkasan Final

MVP final:

```text
Affiliate daftar
→ Google Apps Script generate kode unik
→ Data affiliate masuk Google Sheet
→ Affiliate langsung mendapat link
→ Affiliate share link webinar
→ Lead daftar dari link
→ Lead masuk Google Sheet dengan ref_code
→ Admin follow-up dan validasi closing
→ Komisi dibayar manual
```

Stack final MVP:

```text
Cloudflare Pages + Google Apps Script + Google Sheet
```
