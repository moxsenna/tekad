import { Check } from 'lucide-react';

export function TrustLPKSection() {
  const points = [
    'LPK resmi yang fokus pada pelatihan digital, AI, marketing, dan content creation.',
    'Program dirancang berbasis praktik dan portofolio karya, bukan hanya teori hafalan.',
    'Didampingi langsung oleh mentor/instruktur praktisi industri.',
    'Materi pembelajaran mengarah pada kesiapan karier, freelance, dan bisnis digital.',
  ];

  return (
    <section className="section section--cream" id="trust-lpk">
      <div className="container">
        <div className="trust-lpk__grid">
          <div className="trust-lpk__copy">
            <h2 className="section__title">Kenapa Bapak/Ibu Bisa Percaya TEKAD?</h2>
            <div className="trust-lpk__list">
              {points.map((point, index) => (
                <div key={index} className="trust-lpk__item">
                  <div className="trust-lpk__icon">
                    <Check size={18} aria-hidden="true" />
                  </div>
                  <p className="trust-lpk__text">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="trust-lpk__cert">
            <div className="trust-lpk__image-wrapper">
              <span className="trust-lpk__image-badge">Dokumen Legalitas Resmi</span>
              <img
                src="/sert lpk.webp"
                alt="Sertifikat Legalitas Resmi LPK TEKAD"
                className="trust-lpk__image"
                loading="lazy"
                width={440}
                height={620}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
