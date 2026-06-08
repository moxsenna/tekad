# PRD — Landing Page Webinar TEKAD

## “Dari Bingung Arah Menjadi Siap Kerja”

## 1. Ringkasan Produk

Produk yang akan dibuat adalah landing page pendaftaran webinar gratis untuk LPK TEKAD dengan tema:

**“Dari Bingung Arah Menjadi Siap Kerja”**

Landing page ini ditujukan untuk mengumpulkan database orang tua yang memiliki anak SMA/SMK, lulusan sekolah, mahasiswa, fresh graduate, gap year, atau anak yang belum memiliki arah karir yang jelas.

Alur utama produk:

1. Pengunjung membuka landing page webinar.
2. Pengunjung membaca penjelasan dan manfaat webinar.
3. Pengunjung klik tombol **“Daftar Webinar Gratis”**.
4. Pengunjung mengisi form modern ala Typeform/conversational multi-step form.
5. Data pendaftaran dikirim ke Google Apps Script.
6. Google Apps Script menyimpan data ke Google Sheet.
7. Setelah submit berhasil, pengunjung otomatis diarahkan ke WhatsApp admin TEKAD atau grup webinar.
8. Tim TEKAD melakukan follow-up dari Google Sheet.

Platform utama:

* Hosting landing page: **Cloudflare Pages**
* Frontend: **React + Vite** direkomendasikan
* Penyimpanan data: **Google Sheet**
* Middleware submit form: **Google Apps Script Web App**
* Redirect komunikasi: **WhatsApp link**

---

## 2. Latar Belakang

LPK TEKAD membutuhkan funnel sederhana, profesional, dan cepat dieksekusi untuk mengumpulkan database orang tua calon peserta program TEKAD.

Target audience utama bukan calon peserta langsung, melainkan orang tua yang memiliki kekhawatiran tentang masa depan anak, terutama:

* Anak belum punya arah setelah lulus SMA/SMK.
* Anak tidak lulus PTN atau sedang gap year.
* Anak kuliah tetapi belum punya skill kerja.
* Anak fresh graduate tetapi belum bekerja.
* Anak sering memakai HP/media sosial tetapi belum produktif.
* Orang tua ingin anak lebih siap kerja, punya skill praktis, punya portofolio, dan mampu bersaing di era digital dan AI.

Landing page ini bukan halaman hard selling program 5 juta. Fokus utama halaman adalah:

* Mengundang orang tua ke webinar gratis.
* Membangun kepercayaan.
* Mengumpulkan data prospek.
* Mengarahkan prospek ke WhatsApp.
* Menyiapkan database untuk nurturing dan konsultasi.

---

## 3. Tujuan Produk

### 3.1 Tujuan Utama

Membuat landing page pendaftaran webinar gratis yang mampu:

* Menjelaskan value webinar dengan bahasa yang mudah dipahami orang tua.
* Memberi harapan bahwa anak masih bisa diarahkan menjadi lebih siap kerja.
* Mengumpulkan data orang tua calon peserta.
* Menyimpan data otomatis ke Google Sheet.
* Mengarahkan pendaftar ke WhatsApp setelah submit.
* Memudahkan tim TEKAD melakukan follow-up.

### 3.2 Tujuan Bisnis

* Mengumpulkan database orang tua prospek.
* Meningkatkan jumlah peserta webinar.
* Meningkatkan jumlah percakapan WhatsApp dengan calon peserta.
* Meningkatkan peluang konsultasi 1-on-1.
* Menyiapkan funnel awal menuju program TEKAD 5 juta.
* Memvalidasi angle marketing “anak siap kerja” sebelum menjalankan iklan berbayar.

### 3.3 Tujuan Teknis

* Landing page ringan, cepat, responsif, dan mudah di-deploy ke Cloudflare Pages.
* Form terasa modern, profesional, dan tidak seperti form administrasi panjang.
* Data dapat dikirim tanpa backend berbayar.
* Data masuk ke Google Sheet secara rapi.
* Redirect WhatsApp berjalan otomatis setelah data berhasil disimpan.
* Query parameter source/UTM dapat ditangkap untuk tracking sumber lead.

---

## 4. Target Pengguna

### 4.1 Primary User

Orang tua usia 35–55 tahun yang memiliki anak:

* Kelas 11–12 SMA/SMK.
* Baru lulus SMA/SMK.
* Gap year.
* Tidak lulus PTN.
* Mahasiswa awal/akhir yang belum punya skill kerja.
* Fresh graduate yang belum bekerja.
* Anak yang belum punya arah karir.
* Anak yang tertarik HP, media sosial, konten, desain, video, teknologi, atau AI.

### 4.2 Secondary User

* Guru BK.
* Pengurus sekolah.
* Komunitas orang tua.
* Komunitas UMKM.
* Admin/marketing TEKAD.

---

## 5. Positioning Landing Page

Landing page harus terasa sebagai undangan edukatif dan memberi harapan, bukan halaman jualan agresif.

### 5.1 Core Message

**“Anak yang hari ini masih bingung arah bukan berarti tidak punya masa depan. Dengan arahan, skill praktis, mentor, dan portofolio yang tepat, anak bisa mulai disiapkan menghadapi dunia kerja.”**

### 5.2 Headline Utama

**Dari Bingung Arah Menjadi Siap Kerja**

### 5.3 Subheadline

**Webinar gratis untuk orang tua yang ingin membantu anak setelah SMA/SMK/kuliah agar punya arah, skill praktis, dan lebih percaya diri menghadapi dunia kerja di era digital dan AI.**

### 5.4 Tone Komunikasi

Gunakan tone:

* Hangat.
* Memberi harapan.
* Profesional.
* Empatik.
* Tidak menghakimi anak.
* Tidak menyalahkan orang tua.
* Tidak menakut-nakuti berlebihan.
* Tidak menjanjikan anak pasti kerja.
* Tidak menjanjikan penghasilan pasti.
* Fokus pada kesiapan, arahan, skill, portofolio, dan peluang.

---

## 6. Scope Produk

### 6.1 In Scope

Produk versi pertama harus mencakup:

1. Landing page responsif.
2. Hero section dengan headline dan CTA.
3. Section masalah orang tua.
4. Section reframe/harapan.
5. Section manfaat webinar.
6. Section “untuk siapa webinar ini”.
7. Section materi webinar.
8. Section tentang TEKAD singkat.
9. Form pendaftaran modern ala Typeform.
10. Validasi form per step.
11. Submit form ke Google Apps Script.
12. Simpan data ke Google Sheet.
13. Redirect otomatis ke WhatsApp setelah sukses.
14. Tracking source dari query parameter.
15. Basic success/error state.
16. README setup Cloudflare Pages.
17. README setup Google Apps Script dan Google Sheet.

### 6.2 Out of Scope untuk Versi Pertama

Fitur berikut tidak perlu dibuat di versi pertama:

* Login admin.
* Dashboard CRM.
* Email automation.
* WhatsApp API otomatis.
* Payment gateway.
* Database Supabase.
* CMS.
* A/B testing otomatis.
* Multi-webinar management.
* Payment/program checkout.
* Meta Pixel/GTM wajib.

Namun siapkan placeholder agar Meta Pixel/GTM bisa ditambahkan nanti.

---

## 7. User Journey

### 7.1 Journey Orang Tua

1. Orang tua melihat link dari WhatsApp, Facebook, Instagram, guru, sekolah, komunitas, atau iklan.
2. Orang tua klik link landing page.
3. Orang tua membaca headline dan merasa relevan.
4. Orang tua membaca manfaat webinar.
5. Orang tua klik tombol **“Daftar Webinar Gratis”**.
6. Form ala Typeform terbuka.
7. Orang tua menjawab pertanyaan satu per satu.
8. Orang tua melihat ringkasan data.
9. Orang tua klik **“Kirim Pendaftaran”**.
10. Data tersimpan ke Google Sheet.
11. Orang tua diarahkan ke WhatsApp admin/grup.
12. Admin TEKAD menyapa calon peserta.
13. Admin mengirim jadwal webinar dan follow-up konsultasi.

### 7.2 Journey Admin TEKAD

1. Admin membuka Google Sheet.
2. Admin melihat data pendaftar baru.
3. Admin memfilter berdasarkan status anak, kota, kekhawatiran, dan sumber lead.
4. Admin menghubungi prospek via WhatsApp.
5. Admin memberi reminder webinar.
6. Admin follow-up konsultasi setelah webinar.
7. Admin memberi tag manual pada kolom follow_up_status.

---

## 8. Struktur Halaman Landing Page

### 8.1 Header

Elemen:

* Logo/teks “LPK TEKAD”
* Navigasi minimal:

  * Manfaat
  * Untuk Siapa
  * Materi
  * Daftar
* Tombol CTA kecil: **“Daftar Gratis”**

Catatan:
Navigasi harus smooth scroll ke section terkait.

---

### 8.2 Hero Section

Headline:

**Dari Bingung Arah Menjadi Siap Kerja**

Subheadline:

**Webinar gratis untuk orang tua yang ingin membantu anak setelah SMA/SMK/kuliah agar punya arah, skill praktis, dan lebih percaya diri menghadapi dunia kerja di era digital dan AI.**

Bullet pendukung:

* Cocok untuk orang tua anak SMA/SMK, mahasiswa, fresh graduate, atau gap year.
* Bahas peta 90 hari membangun skill digital dan AI dari nol.
* Dapatkan gambaran portofolio yang bisa membantu anak lebih percaya diri.
* Ada sesi tanya jawab dan kesempatan konsultasi.

CTA utama:

**Daftar Webinar Gratis**

CTA sekunder:

**Lihat Manfaat Webinar**

Microcopy:

**Gratis. Link webinar akan dikirim melalui WhatsApp.**

Visual:
Gunakan ilustrasi/foto keluarga/orang tua dan anak muda yang sedang berdiskusi, belajar dengan laptop, atau suasana edukatif yang hangat.

---

### 8.3 Problem Section

Judul:

**Apakah Bapak/Ibu Pernah Merasakan Ini?**

Isi:

* Anak sudah mau lulus, tapi belum tahu mau ke mana.
* Anak ingin kerja, tapi belum punya skill dan portofolio.
* Anak sering memakai HP, tapi belum diarahkan menjadi produktif.
* Orang tua ingin membantu, tapi bingung harus mulai dari mana.
* Kuliah penting, tapi skill kerja praktis juga perlu disiapkan.

Tone:
Jangan menyalahkan anak atau orang tua. Gunakan pendekatan empatik.

---

### 8.4 Hope/Reframe Section

Judul:

**Anak yang Bingung Arah Masih Bisa Dibimbing**

Isi:

Anak tidak harus langsung sempurna. Yang dibutuhkan adalah:

* Arah yang jelas.
* Skill yang relevan.
* Latihan rutin.
* Mentor/pembimbing.
* Proyek nyata.
* Portofolio yang bisa ditunjukkan.

Copy pendek:

**Kabar baiknya, anak bisa mulai dari nol. Dengan arahan yang tepat, mereka bisa mulai membangun skill digital, memahami AI sebagai alat produktivitas, membuat karya sederhana, dan perlahan memiliki portofolio yang bisa ditunjukkan.**

---

### 8.5 Webinar Benefit Section

Judul:

**Apa yang Akan Bapak/Ibu Dapatkan di Webinar Ini?**

Benefit:

1. Memahami kenapa banyak anak belum siap kerja.
2. Mengetahui skill digital dan AI yang bisa dipelajari dari nol.
3. Mendapat gambaran peta 90 hari membangun kesiapan kerja anak.
4. Mengetahui contoh portofolio yang bisa dibuat anak.
5. Memahami cara mendampingi anak tanpa memaksa.
6. Mendapat checklist kesiapan kerja anak.
7. Berkesempatan konsultasi kondisi anak.

---

### 8.6 Audience Section

Judul:

**Webinar Ini Cocok untuk Orang Tua yang Memiliki Anak:**

Items:

* Kelas 11 atau 12 SMA/SMK.
* Baru lulus SMA/SMK.
* Sedang gap year.
* Tidak lulus PTN dan sedang mencari arah.
* Mahasiswa yang belum punya skill kerja.
* Fresh graduate yang belum bekerja.
* Suka HP/media sosial tapi belum produktif.
* Ingin belajar digital, AI, konten, marketing, atau bisnis online.

---

### 8.7 What Will Be Discussed Section

Judul:

**Materi yang Akan Dibahas**

Materi:

1. Realita dunia kerja di era digital dan AI.
2. Kenapa anak perlu skill praktis, bukan hanya ijazah.
3. Skill digital yang bisa dimulai dari nol.
4. Cara mengubah kebiasaan memakai HP menjadi karya digital.
5. Contoh jalur siap kerja:

   * AI Content Assistant
   * Social Media Admin
   * Digital Marketing Assistant
   * AI Productivity Assistant
   * Chatbot/Automation Assistant
6. Peta 90 hari:

   * Bulan 1: literasi AI dan produktivitas
   * Bulan 2: konten, desain, video, dan marketing
   * Bulan 3: automation, chatbot, portofolio, dan orientasi kerja/usaha
7. Cara orang tua mendukung anak dengan tepat.

---

### 8.8 TEKAD Credibility Section

Judul:

**Tentang LPK TEKAD**

Isi ringkas:

LPK TEKAD adalah lembaga pelatihan yang berfokus pada penguatan keterampilan bisnis, digital marketing, AI, social media marketing, dan content creation. Program TEKAD mengutamakan praktik langsung, pendampingan, portofolio nyata, sertifikat, serta orientasi karir dan bisnis.

Elemen trust:

* Fokus praktik langsung.
* Mentor/instruktur praktisi.
* Kurikulum digital marketing dan AI.
* Portofolio nyata.
* Sertifikat.
* Career/business orientation.
* Komunitas dan pendampingan.

---

## 9. Form Pendaftaran Modern ala Typeform

### 9.1 Konsep Form

Form pendaftaran tidak boleh berbentuk form panjang biasa. Form harus dibuat modern dan profesional seperti Typeform, yaitu:

* Satu pertanyaan per layar/card.
* Tampilan conversational.
* Ada progress bar.
* Ada step counter.
* Ada tombol Back dan Next.
* Pilihan jawaban berbentuk card modern.
* Validasi dilakukan per step.
* Data dikirim hanya di step terakhir.
* Setelah submit sukses, user diarahkan ke WhatsApp.

Alur form:

**Landing page → klik “Daftar Webinar Gratis” → form full-screen/multi-step → submit → Google Sheet → redirect WhatsApp**

---

### 9.2 Mode Tampilan Form

Gunakan **Mode B — Full Screen Form**.

Saat user klik tombol **“Daftar Webinar Gratis”**, tampil overlay/full-screen form seperti Typeform.

Form full-screen harus memiliki:

* Background bersih/premium.
* Card pertanyaan di tengah.
* Progress bar di atas.
* Step counter.
* Tombol close untuk kembali ke landing page.
* Tombol Back/Next.
* Mobile-first design.

---

### 9.3 Prinsip UX Form

1. User tidak boleh melihat semua pertanyaan sekaligus.
2. Satu layar hanya menampilkan satu pertanyaan utama.
3. Tampilan harus clean, premium, dan mobile-first.
4. Setiap step memiliki microcopy pendek agar terasa seperti dibimbing.
5. Progress bar harus terlihat.
6. Tombol harus besar dan mudah ditekan di HP.
7. Pilihan jawaban dibuat dalam bentuk card/radio button modern.
8. Input text harus besar, jelas, dan tidak terasa seperti form administrasi.
9. User bisa kembali ke pertanyaan sebelumnya tanpa kehilangan jawaban.
10. Data baru dikirim setelah semua step selesai dan user menekan tombol final.
11. Setelah submit berhasil, redirect otomatis ke WhatsApp.

---

### 9.4 Komponen UI Form

Form harus memiliki:

* Progress bar di bagian atas.
* Step counter, contoh: **“Pertanyaan 2 dari 8”**.
* Judul pertanyaan besar.
* Helper text kecil.
* Input/pilihan jawaban.
* Tombol **“Lanjut”**.
* Tombol **“Kembali”**.
* Tombol close untuk kembali ke landing page.
* Loading state saat submit.
* Error state jika submit gagal.
* Success state singkat sebelum redirect WhatsApp.

---

## 10. Detail Step Form

### Step 0 — Welcome Screen

Title:

**Siap membantu anak lebih punya arah?**

Subtitle:

**Jawab beberapa pertanyaan singkat agar tim TEKAD dapat mengirimkan informasi webinar yang sesuai dengan kondisi anak Bapak/Ibu.**

Button:

**Mulai Daftar**

---

### Step 1 — Nama Orang Tua

Question:

**Nama Bapak/Ibu siapa?**

Helper:

**Kami akan menggunakan nama ini saat menghubungi Bapak/Ibu melalui WhatsApp.**

Field:

`nama_orang_tua`

Type:

`text`

Required:

`true`

Placeholder:

**Contoh: Ibu Siti / Bapak Ahmad**

Button:

**Lanjut**

---

### Step 2 — Nomor WhatsApp

Question:

**Nomor WhatsApp aktif Bapak/Ibu?**

Helper:

**Link webinar dan informasi lanjutan akan dikirim melalui WhatsApp.**

Field:

`whatsapp`

Type:

`tel`

Required:

`true`

Placeholder:

**08xxxxxxxxxx**

Validation:

* Minimal 9 digit angka.
* Terima format 08, 628, dan +628.
* Tampilkan error jika terlalu pendek atau berisi karakter tidak valid.

---

### Step 3 — Status Anak

Question:

**Saat ini anak Bapak/Ibu berada di tahap apa?**

Helper:

**Pilih yang paling sesuai.**

Field:

`status_anak`

Type:

`single_choice_card`

Required:

`true`

Options:

* Kelas 11 SMA/SMK
* Kelas 12 SMA/SMK
* Baru lulus SMA/SMK
* Gap year / belum kuliah
* Mahasiswa
* Fresh graduate
* Belum bekerja
* Lainnya

UI:
Pilihan ditampilkan sebagai card besar, bukan dropdown kecil.

---

### Step 4 — Kondisi Anak

Question:

**Kondisi mana yang paling menggambarkan anak Bapak/Ibu saat ini?**

Helper:

**Jawaban ini membantu kami memahami kebutuhan anak Bapak/Ibu.**

Field:

`kondisi_anak`

Type:

`single_choice_card`

Required:

`true`

Options:

* Masih bingung arah
* Ingin langsung kerja
* Ingin kuliah, tapi perlu skill tambahan
* Ingin mulai usaha
* Suka konten/media sosial
* Suka desain/video
* Tertarik teknologi/AI
* Belum terlihat minatnya

---

### Step 5 — Kekhawatiran Utama

Question:

**Apa kekhawatiran terbesar Bapak/Ibu tentang masa depan anak?**

Helper:

**Boleh ditulis singkat. Contoh: belum percaya diri, belum punya skill, terlalu sering main HP, belum tahu mau kerja apa.**

Field:

`kekhawatiran_utama`

Type:

`textarea`

Required:

`false`

Placeholder:

**Tulis kekhawatiran Bapak/Ibu di sini…**

Button:

**Lanjut**

Secondary option:

**Lewati**

---

### Step 6 — Domisili

Question:

**Bapak/Ibu berdomisili di kota/kecamatan mana?**

Helper:

**Ini membantu kami menyesuaikan informasi kegiatan dan konsultasi.**

Field:

`kota`

Type:

`text`

Required:

`true`

Placeholder:

**Contoh: Cirebon / Indramayu / Kuningan**

---

### Step 7 — Kesediaan Konsultasi

Question:

**Apakah Bapak/Ibu bersedia dihubungi untuk konsultasi gratis setelah webinar?**

Helper:

**Konsultasi ini bertujuan membantu memetakan kondisi anak. Tidak wajib langsung mendaftar program.**

Field:

`bersedia_konsultasi`

Type:

`single_choice_card`

Required:

`true`

Options:

* Ya, saya bersedia
* Nanti dulu, cukup ikut webinar

---

### Step 8 — Review & Submit

Title:

**Terima kasih, data hampir selesai.**

Subtitle:

**Klik tombol di bawah ini untuk mengirim pendaftaran. Setelah berhasil, Bapak/Ibu akan diarahkan ke WhatsApp TEKAD.**

Show summary:

* Nama orang tua
* WhatsApp
* Status anak
* Kondisi anak
* Kota
* Kesediaan konsultasi

Button:

**Kirim Pendaftaran**

Back button:

**Kembali**

Loading:

**Mengirim pendaftaran…**

Success:

**Pendaftaran berhasil. Mengarahkan ke WhatsApp…**

Error:

**Maaf, pendaftaran belum berhasil terkirim. Silakan coba lagi.**

---

## 11. Data Handling Form

Semua jawaban disimpan sementara di state JavaScript/browser selama user mengisi form.

Data hanya dikirim ke Google Apps Script pada Step 8 saat tombol **“Kirim Pendaftaran”** ditekan.

Payload yang dikirim:

* `submitted_at`
* `nama_orang_tua`
* `whatsapp`
* `whatsapp_normalized`
* `status_anak`
* `kondisi_anak`
* `kekhawatiran_utama`
* `kota`
* `bersedia_konsultasi`
* `source`
* `utm_source`
* `utm_medium`
* `utm_campaign`
* `page_url`
* `user_agent`

Optional future field:

* `nama_anak`

Catatan:
Untuk versi pertama, `nama_anak` tidak wajib agar form terasa ringan dan tidak terlalu personal di awal.

---

## 12. Keyboard & Mobile UX

Form harus nyaman digunakan di HP.

Requirements:

* Tekan Enter pada text input dapat lanjut ke step berikutnya jika valid.
* Pilihan card bisa dipilih dengan tap.
* Setelah memilih card, user tetap perlu klik **“Lanjut”** agar tidak terasa terlalu cepat.
* Di mobile, tombol **“Lanjut”** sticky di bagian bawah.
* Gunakan font minimal 18px untuk pertanyaan.
* Hindari dropdown kecil.
* Hindari tabel.
* Hindari form dua kolom di mobile.
* Form harus nyaman digunakan satu tangan.

---

## 13. Visual Style Form

Form harus terasa seperti produk premium, bukan Google Form.

Rekomendasi styling:

* Background: gradient lembut navy/blue/cream atau putih bersih.
* Card form: putih, border radius 24px, shadow lembut.
* Progress bar: biru atau teal.
* Selected option: border biru/teal, background biru sangat muda.
* Button utama: navy atau blue, rounded besar.
* Button secondary: text button atau outline.
* Error: merah lembut, tidak agresif.

Animasi:

* Fade/slide antar step.
* Progress bar smooth.
* Button loading spinner kecil.
* Jangan gunakan animasi berat yang memperlambat loading.

---

## 14. WhatsApp Redirect

Setelah form berhasil tersimpan, user diarahkan ke WhatsApp.

### 14.1 WhatsApp Admin Link

Format:

`https://wa.me/628xxxxxxxxxx?text=Halo%20Admin%20TEKAD%2C%20saya%20sudah%20daftar%20webinar%20Dari%20Bingung%20Arah%20Menjadi%20Siap%20Kerja.%20Mohon%20info%20jadwal%20dan%20grup%20webinarnya.`

Nomor WhatsApp harus diganti dengan nomor resmi TEKAD.

### 14.2 Alternatif WhatsApp Group Link

Jika ingin langsung masuk grup:

`https://chat.whatsapp.com/xxxxx`

Rekomendasi:
Untuk awal, arahkan ke WhatsApp admin dulu agar data lebih terkendali dan admin bisa menyapa personal.

---

## 15. Google Sheet Specification

Buat Google Sheet dengan nama:

**Database Webinar TEKAD - Dari Bingung Arah Menjadi Siap Kerja**

Sheet utama:

**Leads**

Kolom:

1. `submitted_at`
2. `nama_orang_tua`
3. `whatsapp`
4. `whatsapp_normalized`
5. `status_anak`
6. `kondisi_anak`
7. `kekhawatiran_utama`
8. `kota`
9. `bersedia_konsultasi`
10. `source`
11. `utm_source`
12. `utm_medium`
13. `utm_campaign`
14. `page_url`
15. `user_agent`
16. `follow_up_status`
17. `notes`

Default `follow_up_status`:

**new**

---

## 16. Google Apps Script Requirement

Google Apps Script harus:

1. Menerima request POST dari landing page.
2. Membaca payload JSON.
3. Memvalidasi minimal:

   * `nama_orang_tua` wajib ada.
   * `whatsapp` wajib ada.
   * `status_anak` wajib ada.
   * `kondisi_anak` wajib ada.
   * `kota` wajib ada.
   * `bersedia_konsultasi` wajib ada.
4. Menulis data ke sheet **“Leads”**.
5. Menambahkan timestamp server jika `submitted_at` tidak tersedia.
6. Mengisi `follow_up_status` dengan `new`.
7. Mengembalikan response JSON:

   * `success: true`
   * `message: "Lead saved"`
8. Jika error, mengembalikan:

   * `success: false`
   * `message: alasan error`

Security minimal:

* Gunakan secret token sederhana.
* Landing page mengirim token di payload.
* Apps Script menolak request jika token salah.

Catatan:
Token di frontend bukan keamanan tingkat tinggi karena bisa terlihat di browser. Namun cukup untuk mengurangi submit random. Untuk versi production yang lebih aman, gunakan Cloudflare Worker sebagai proxy.

---

## 17. Cloudflare Pages Requirement

### 17.1 Struktur Project Rekomendasi

Gunakan React + Vite.

Struktur repo:

```text
tekad-webinar-landing/
  public/
    logo.png
    hero.webp
  src/
    App.tsx
    main.tsx
    components/
      Header.tsx
      HeroSection.tsx
      ProblemSection.tsx
      BenefitSection.tsx
      AudienceSection.tsx
      MaterialSection.tsx
      TekadSection.tsx
      TypeformLeadForm.tsx
      ProgressBar.tsx
      ChoiceCard.tsx
    lib/
      tracking.ts
      submitLead.ts
      validation.ts
      whatsapp.ts
    styles/
      global.css
  google-apps-script/
    Code.gs
  package.json
  README.md
```

### 17.2 Deploy Cloudflare Pages

Jika memakai Vite:

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

Environment variables di Cloudflare Pages:

```text
VITE_GOOGLE_SCRIPT_URL=
VITE_WHATSAPP_REDIRECT_URL=
VITE_FORM_TOKEN=
```

---

## 18. Design Requirement

### 18.1 Visual Style

Tone visual:

* Hangat.
* Optimis.
* Profesional.
* Cocok untuk orang tua.
* Tidak terlalu techy.
* Tidak terlalu ramai.
* Terasa premium dan terpercaya.

Warna rekomendasi:

* Navy: `#16324F`
* Blue: `#2563EB`
* Teal: `#14B8A6`
* Warm Yellow: `#FBBF24`
* Soft Cream: `#FFFBEB`
* Text Dark: `#111827`
* Text Muted: `#6B7280`
* Border: `#E5E7EB`

### 18.2 Typography

Gunakan salah satu:

* Plus Jakarta Sans
* Inter
* Poppins

Rekomendasi utama:

**Plus Jakarta Sans**

### 18.3 Layout

* Mobile-first.
* Maksimal lebar konten 1120px.
* CTA harus terlihat di hero dan sebelum form.
* Section harus lega.
* Gunakan card untuk benefit.
* Form harus terasa seperti Typeform, bukan form panjang.
* Tombol besar dan jelas.

---

## 19. Form Validation

### 19.1 Required Fields

Form tidak boleh lanjut/submit jika field berikut kosong:

* `nama_orang_tua`
* `whatsapp`
* `status_anak`
* `kondisi_anak`
* `kota`
* `bersedia_konsultasi`

### 19.2 WhatsApp Validation

Nomor WhatsApp harus:

* Tidak kosong.
* Minimal 9 digit angka.
* Mengizinkan format:

  * `08xxxxxxxxxx`
  * `628xxxxxxxxxx`
  * `+628xxxxxxxxxx`

Normalisasi:

* Jika dimulai dengan `08`, ubah menjadi `628`.
* Jika dimulai dengan `+628`, ubah menjadi `628`.
* Simpan hasil normalisasi ke `whatsapp_normalized`.

### 19.3 Duplicate Handling

Versi pertama:

* Tetap simpan semua data meskipun nomor sama.

Versi berikutnya:

* Bisa dedupe berdasarkan nomor WhatsApp.

---

## 20. Tracking Source

Landing page harus menangkap query parameter berikut:

* `source`
* `utm_source`
* `utm_medium`
* `utm_campaign`

Contoh link:

```text
https://domain.pages.dev/?source=wa_status
https://domain.pages.dev/?source=fb_post
https://domain.pages.dev/?source=guru_bk
https://domain.pages.dev/?utm_source=facebook&utm_medium=organic&utm_campaign=webinar_siap_kerja
```

Jika tidak ada source, isi default:

```text
direct
```

---

## 21. Privacy & Consent

Tambahkan teks persetujuan kecil sebelum submit:

**Dengan mengisi form ini, Bapak/Ibu bersedia dihubungi oleh tim TEKAD melalui WhatsApp untuk informasi webinar dan konsultasi terkait program.**

Privacy requirement:

* Jangan menampilkan data pendaftar di halaman publik.
* Jangan menyimpan data sensitif selain kebutuhan follow-up webinar.
* Jangan meminta data anak yang terlalu sensitif di versi pertama.
* Jangan meminta alamat lengkap.
* Jangan meminta informasi keuangan pribadi.

---

## 22. Copywriting Landing Page

### 22.1 Hero

Headline:

**Dari Bingung Arah Menjadi Siap Kerja**

Subheadline:

**Webinar gratis untuk orang tua yang ingin membantu anak setelah SMA/SMK/kuliah agar punya arah, skill praktis, dan lebih percaya diri menghadapi dunia kerja di era digital dan AI.**

CTA:

**Daftar Webinar Gratis**

Microcopy:

**Gratis. Link webinar akan dikirim melalui WhatsApp.**

---

### 22.2 Problem

Judul:

**Banyak Anak Bukan Tidak Mampu, Mereka Hanya Belum Punya Arah**

Isi:

Setelah lulus sekolah atau kuliah, banyak anak masih bingung harus mulai dari mana. Orang tua ingin membantu, tetapi sering tidak tahu skill apa yang benar-benar dibutuhkan di dunia kerja saat ini.

---

### 22.3 Hope

Judul:

**Kabar Baiknya, Anak Bisa Mulai dari Nol**

Isi:

Anak tidak harus langsung jago. Dengan arahan yang tepat, mereka bisa mulai membangun skill digital, memahami AI sebagai alat produktivitas, membuat karya sederhana, dan perlahan memiliki portofolio yang bisa ditunjukkan.

---

### 22.4 Benefit

Judul:

**Di Webinar Ini, Bapak/Ibu Akan Belajar:**

Bullets:

* Cara membaca kondisi anak yang masih bingung arah.
* Skill digital dan AI yang bisa dipelajari pemula.
* Peta 90 hari agar anak lebih produktif.
* Contoh portofolio yang bisa membantu anak lebih percaya diri.
* Cara mendampingi anak tanpa memaksa.
* Pilihan jalur setelah sekolah: kerja, kuliah, freelance, atau usaha digital.

---

### 22.5 Form CTA

Judul:

**Daftar Webinar Gratis Sekarang**

Subcopy:

Isi data singkat berikut agar tim TEKAD dapat mengirimkan informasi jadwal webinar melalui WhatsApp.

Button:

**Mulai Daftar**

---

## 23. Technical Implementation Notes

### 23.1 Frontend

Gunakan:

* React
* Vite
* TypeScript
* CSS biasa atau CSS Modules

Tidak perlu library UI berat.

Library opsional:

* `lucide-react` untuk ikon ringan.
* Tidak perlu Tailwind jika ingin setup sederhana, tetapi Tailwind boleh digunakan jika builder lebih cepat.

### 23.2 Environment Config

Di frontend gunakan env:

```text
VITE_GOOGLE_SCRIPT_URL=...
VITE_WHATSAPP_REDIRECT_URL=...
VITE_FORM_TOKEN=...
```

### 23.3 Submit Logic

Flow JavaScript:

1. User membuka form.
2. Jawaban disimpan di state.
3. Validasi per step.
4. Di step terakhir, user klik **“Kirim Pendaftaran”**.
5. Collect form data.
6. Add tracking params.
7. Add `page_url` dan `user_agent`.
8. Disable submit button.
9. Show loading.
10. POST ke Google Apps Script.
11. Jika success, tampilkan success singkat.
12. Redirect ke WhatsApp.
13. Jika error, tampilkan error dan re-enable button.

---

## 24. Testing Plan

### 24.1 Manual Test

Test case:

1. Open landing page desktop.
2. Open landing page mobile.
3. Click CTA hero.
4. Confirm form full-screen terbuka.
5. Confirm user hanya melihat satu pertanyaan per step.
6. Submit step kosong dan pastikan validasi muncul.
7. Isi semua step sampai review.
8. Submit valid form.
9. Check Google Sheet row.
10. Confirm redirect WhatsApp.
11. Test URL dengan `?source=wa_status`.
12. Confirm source masuk ke Google Sheet.
13. Test invalid WhatsApp.
14. Test Back button tidak menghapus jawaban.
15. Test Close button kembali ke landing page.
16. Test Google Apps Script URL unavailable.

### 24.2 Browser Test

Minimal test di:

* Chrome desktop.
* Chrome Android.
* Safari iPhone jika ada.
* Edge desktop.

---

## 25. Acceptance Criteria

### 25.1 Landing Page

* Given user membuka halaman di mobile,

* When halaman selesai load,

* Then headline **“Dari Bingung Arah Menjadi Siap Kerja”** terlihat jelas.

* Given user klik CTA **“Daftar Webinar Gratis”**,

* When tombol diklik,

* Then form full-screen ala Typeform terbuka.

* Given user membaca section manfaat,

* Then terdapat minimal 5 manfaat yang jelas untuk orang tua.

### 25.2 Typeform-Style Form

* User tidak melihat semua pertanyaan sekaligus.
* Form menampilkan satu pertanyaan per step.
* Progress bar berubah sesuai step.
* Step counter tampil.
* Tombol Back dapat mengembalikan user ke step sebelumnya tanpa kehilangan jawaban.
* Field wajib divalidasi sebelum lanjut step.
* Pilihan jawaban tampil dalam bentuk card.
* Submit hanya terjadi di step terakhir.
* Saat submit, tombol loading dan tidak bisa diklik berulang.
* Setelah submit berhasil, user redirect ke WhatsApp.
* Tampilan mobile nyaman digunakan satu tangan.

### 25.3 Google Sheet

* Given form berhasil disubmit,
* Then Google Sheet menampilkan row baru.
* Row harus memuat:

  * timestamp
  * nama orang tua
  * nomor WhatsApp
  * status anak
  * kondisi anak
  * kota
  * source
  * follow_up_status = new

### 25.4 Tracking

* Given user membuka URL dengan `?source=wa_status`,
* When user submit form,
* Then kolom source di Google Sheet berisi `wa_status`.

---

## 26. Non-Functional Requirements

### 26.1 Performance

* Landing page harus ringan.
* Target load awal di koneksi mobile normal maksimal 3 detik.
* Hindari library berat.
* Gambar harus dikompresi.
* Form animation tidak boleh mengganggu performa.

### 26.2 Accessibility

* Label form jelas.
* Tombol punya kontras cukup.
* Input bisa diakses di mobile.
* Font minimal 16px untuk body text.
* Pertanyaan form minimal 18px.
* Error message harus jelas.

### 26.3 Reliability

* Jika Google Apps Script lambat, tampilkan loading.
* Jika gagal, jangan menghapus data yang sudah diisi user.
* User bisa mencoba submit ulang.
* Redirect hanya dilakukan setelah submit success.

### 26.4 Privacy

* Jangan menampilkan data pendaftar di halaman publik.
* Jangan menyimpan data sensitif yang tidak perlu.
* Tampilkan consent sebelum submit.

---

## 27. Deployment Plan

### 27.1 Google Sheet

1. Buat Google Sheet baru.
2. Beri nama: **Database Webinar TEKAD - Dari Bingung Arah Menjadi Siap Kerja**.
3. Buat sheet bernama **Leads**.
4. Buat header kolom sesuai spesifikasi.
5. Buka Extensions → Apps Script.
6. Tambahkan kode Apps Script.
7. Deploy sebagai Web App.
8. Access: Anyone.
9. Copy Web App URL.
10. Masukkan URL ke env `VITE_GOOGLE_SCRIPT_URL`.

### 27.2 Cloudflare Pages

1. Buat repository GitHub baru.
2. Push project React + Vite.
3. Connect repository ke Cloudflare Pages.
4. Set build command:

```text
npm run build
```

5. Set output directory:

```text
dist
```

6. Tambahkan env:

```text
VITE_GOOGLE_SCRIPT_URL=
VITE_WHATSAPP_REDIRECT_URL=
VITE_FORM_TOKEN=
```

7. Deploy.
8. Test submit.
9. Pasang custom domain jika ada.

---

## 28. Risks & Mitigation

### Risk 1: CORS Google Apps Script bermasalah

Mitigation:

* Gunakan Apps Script Web App dengan response JSON.
* Jika fetch JSON bermasalah, gunakan `application/x-www-form-urlencoded`.
* Jika tetap bermasalah, gunakan Cloudflare Worker proxy sebagai versi berikutnya.

### Risk 2: Spam Submit

Mitigation:

* Tambahkan hidden honeypot field.
* Tambahkan basic token.
* Tambahkan validasi nomor WhatsApp.
* Versi berikutnya bisa pakai Cloudflare Turnstile.

### Risk 3: Data Tidak Masuk Sheet

Mitigation:

* Tampilkan error.
* Simpan log Apps Script.
* Test Apps Script URL langsung.
* Pastikan nama sheet benar.

### Risk 4: User Tidak Masuk WhatsApp Setelah Submit

Mitigation:

* Redirect hanya setelah response success.
* Sediakan fallback link WhatsApp di success message.
* Gunakan `window.location.href`.

---

## 29. Future Enhancement

Setelah versi pertama berjalan, fitur yang bisa ditambahkan:

1. Cloudflare Turnstile anti-spam.
2. Meta Pixel/GTM tracking.
3. Event tracking submit lead.
4. WhatsApp template berdasarkan status anak.
5. Dashboard CRM sederhana.
6. Auto-tagging lead hot/warm/cold.
7. Email backup notification.
8. Integrasi Supabase.
9. A/B testing headline.
10. Countdown jadwal webinar.
11. Halaman thank-you khusus.
12. Download checklist PDF setelah submit.
13. Reminder webinar otomatis.
14. Multi-webinar schedule.
15. Admin follow-up board.

---

## 30. Definition of Done

Project dianggap selesai jika:

* Landing page deploy di Cloudflare Pages.
* Landing page responsif di desktop dan mobile.
* Form tampil modern ala Typeform.
* Form hanya menampilkan satu pertanyaan per step.
* Progress bar dan step counter berjalan.
* Validasi per step berjalan.
* Data berhasil masuk ke Google Sheet.
* Redirect WhatsApp berhasil setelah submit.
* Source tracking masuk ke Sheet.
* README tersedia.
* Instruksi setup Google Sheet, Apps Script, dan Cloudflare Pages jelas.
* Minimal 5 test submit berhasil dilakukan.
* Tidak ada field sensitif yang tidak diperlukan.
