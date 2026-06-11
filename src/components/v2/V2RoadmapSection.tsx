import type { OpenFormFn } from '../../lib/metaPixel';

const ROADMAP_CARDS = [
  { title: 'Bingung Arah', text: 'Anak belum tahu langkah berikutnya.' },
  {
    title: 'Skill Digital',
    text: 'Mulai mengenal AI, konten, desain, media sosial, dan digital marketing.',
  },
  { title: 'Portofolio', text: 'Anak belajar membuat karya yang bisa ditunjukkan.' },
  {
    title: 'Lebih Siap Menghadapi Dunia Kerja',
    text: 'Anak lebih percaya diri menghadapi masa depan.',
  },
] as const;

interface V2RoadmapSectionProps {
  onOpenForm: OpenFormFn;
}

export function V2RoadmapSection({ onOpenForm }: V2RoadmapSectionProps) {
  return (
    <section className="v2-section" id="alur">
      <div className="container">
        <h2 className="v2-section__title">
          Dari Bingung Arah Menuju Lebih Siap Menghadapi Dunia Kerja
        </h2>
        <img
          src="/roadmap-anak-siap-kerja.webp"
          alt="Roadmap: Bingung Arah, Skill Digital, Portofolio, Lebih Siap Menghadapi Dunia Kerja"
          className="v2-roadmap__image"
          width={540}
          height={960}
          loading="lazy"
        />
        <div className="v2-cards">
          {ROADMAP_CARDS.map((card, index) => (
            <div key={card.title} className="v2-card">
              <h3 className="v2-card__title">
                {index + 1}. {card.title}
              </h3>
              <p className="v2-card__text">{card.text}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn--primary"
          style={{ marginTop: '1.25rem' }}
          onClick={() => onOpenForm('roadmap')}
        >
          Daftar Webinar Gratis via WhatsApp
        </button>
      </div>
    </section>
  );
}