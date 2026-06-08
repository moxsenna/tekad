const AUDIENCE = [
  'Kelas 11 atau 12 SMA/SMK',
  'Baru lulus sekolah',
  'Sedang gap year',
  'Tidak lolos PTN',
  'Mahasiswa, tapi belum punya skill kerja',
  'Fresh graduate, tapi belum bekerja',
  'Suka HP, media sosial, desain, video, teknologi, atau AI',
  'Belum terlihat minatnya',
] as const;

export function V2AudienceSection() {
  return (
    <section className="v2-section" id="audience">
      <div className="container">
        <h2 className="v2-section__title">Webinar Ini Cocok untuk Orang Tua yang Anaknya:</h2>
        <ul className="v2-list">
          {AUDIENCE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="v2-microcopy">
          Kalau salah satu poin di atas terasa dekat dengan kondisi anak Ayah/Bunda, webinar ini
          cocok diikuti.
        </p>
      </div>
    </section>
  );
}