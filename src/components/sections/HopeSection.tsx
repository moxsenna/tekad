import { CheckCircle } from 'lucide-react';

const hopePoints = [
  'Arah yang jelas',
  'Skill yang relevan',
  'Latihan rutin',
  'Mentor/pembimbing',
  'Proyek nyata',
  'Portofolio yang bisa ditunjukkan',
];

export function HopeSection() {
  return (
    <section className="section">
      <div className="container hope-content">
        <h2 className="section__title">Anak yang Bingung Arah Masih Bisa Dibimbing</h2>
        <p className="section__subtitle">
          Anak tidak harus langsung sempurna. Yang dibutuhkan adalah fondasi yang tepat agar
          mereka bisa berkembang dengan percaya diri.
        </p>
        <div className="hope-points">
          {hopePoints.map((point) => (
            <div key={point} className="hope-point">
              <CheckCircle size={20} />
              <span>{point}</span>
            </div>
          ))}
        </div>
        <p>
          Kabar baiknya, anak bisa mulai dari nol. Dengan arahan yang tepat, mereka bisa mulai
          membangun skill digital, memahami AI sebagai alat produktivitas, membuat karya
          sederhana, dan perlahan memiliki portofolio yang bisa ditunjukkan.
        </p>
      </div>
    </section>
  );
}