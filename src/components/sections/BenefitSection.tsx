import { CheckCircle } from 'lucide-react';

const benefits = [
  'Cara membaca kondisi anak yang masih bingung arah',
  'Skill digital dan AI yang realistis dipelajari dari nol',
  'Cara mengubah HP menjadi alat belajar dan berkarya',
  'Contoh portofolio awal yang bisa mulai dibuat anak',
  'Cara mendampingi anak tanpa memaksa atau membuatnya tertekan',
];

export function BenefitSection() {
  return (
    <section className="section section--cream" id="manfaat">
      <div className="container">
        <h2 className="section__title">
          Di Webinar Ini, Bapak/Ibu Akan Mendapat Gambaran Praktis Tentang:
        </h2>
        <div className="benefit-checklist">
          {benefits.map((text) => (
            <div key={text} className="benefit-checklist__item">
              <CheckCircle size={22} className="benefit-checklist__icon" aria-hidden="true" />
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}