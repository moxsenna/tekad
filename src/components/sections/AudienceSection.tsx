const audienceItems = [
  'Kelas 11 atau 12 SMA/SMK',
  'Baru lulus SMA/SMK',
  'Sedang gap year',
  'Tidak lulus PTN dan sedang mencari arah',
  'Mahasiswa yang belum punya skill kerja',
  'Fresh graduate yang belum bekerja',
  'Suka HP/media sosial tapi belum produktif',
  'Ingin belajar digital, AI, konten, marketing, atau bisnis online',
];

export function AudienceSection() {
  return (
    <section className="section" id="untuk-siapa">
      <div className="container">
        <h2 className="section__title">Webinar Ini Cocok untuk Orang Tua yang Memiliki Anak:</h2>
        <div className="audience-tags">
          {audienceItems.map((item) => (
            <span key={item} className="audience-tag">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}