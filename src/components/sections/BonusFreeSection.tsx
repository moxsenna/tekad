import { Gift, Check } from 'lucide-react';

export function BonusFreeSection() {
  const points = [
    'Apakah anak sudah punya arah karir/minat yang jelas',
    'Skill digital & AI apa yang perlu mulai dikenalkan ke anak sejak dini',
    'Kebiasaan produktif apa yang perlu mulai dibangun di rumah',
    'Langkah awal konkret apa yang bisa dilakukan setelah webinar',
  ];

  return (
    <section className="section section--white" id="bonus-gratis">
      <div className="container">
        <div className="bonus-free__card">
          <div className="bonus-free__header">
            <div className="bonus-free__badge">
              <Gift size={16} aria-hidden="true" />
              <span>BONUS PENDAFTARAN GRATIS</span>
            </div>
            <h2 className="bonus-free__title">
              Checklist 20 Poin Kesiapan Kerja Anak
            </h2>
            <p className="bonus-free__subtitle">
              Alat bantu evaluasi mandiri untuk melihat kesiapan putra-putri Anda menyongsong masa depan di era digital & AI. Dibagikan secara gratis setelah Bapak/Ibu mendaftar webinar.
            </p>
          </div>
          <div className="bonus-free__body">
            <h3 className="bonus-free__body-title">Checklist ini membantu Bapak/Ibu melihat:</h3>
            <div className="bonus-free__grid">
              {points.map((point, index) => (
                <div key={index} className="bonus-free__item">
                  <div className="bonus-free__icon-check">
                    <Check size={18} aria-hidden="true" className="text-success" />
                  </div>
                  <p className="bonus-free__text">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
