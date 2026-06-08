import { Check } from 'lucide-react';

const audienceItems = [
  'Kelas 11/12 SMA atau SMK',
  'Baru lulus sekolah',
  'Sedang gap year',
  'Tidak lolos PTN dan sedang mencari arah',
  'Mahasiswa yang belum punya skill kerja',
  'Fresh graduate yang belum bekerja',
  'Suka HP, media sosial, desain, video, teknologi, atau AI',
  'Belum terlihat minatnya, tetapi ingin mulai diarahkan',
];

export function AudienceSection() {
  return (
    <section className="section" id="untuk-siapa">
      <div className="container">
        <h2 className="section__title">Webinar Ini Cocok untuk Orang Tua yang Memiliki Anak:</h2>
        <ul className="audience-checklist">
          {audienceItems.map((item) => (
            <li key={item} className="audience-checklist__item">
              <Check size={18} className="audience-checklist__icon" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}