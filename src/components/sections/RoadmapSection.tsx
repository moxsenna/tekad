import type { OpenFormFn } from '../../lib/metaPixel';

const ROADMAP_STEPS = [
  {
    number: 1,
    title: 'Bingung Arah',
    text: 'Anak belum tahu langkah berikutnya.',
  },
  {
    number: 2,
    title: 'Skill Digital',
    text: 'Mulai kenal AI, konten, desain, dan digital marketing.',
  },
  {
    number: 3,
    title: 'Portofolio',
    text: 'Anak belajar membuat karya yang bisa ditunjukkan.',
  },
  {
    number: 4,
    title: 'Lebih Siap Menghadapi Dunia Kerja',
    text: 'Anak lebih percaya diri menghadapi masa depan.',
  },
] as const;

interface RoadmapSectionProps {
  onOpenForm: OpenFormFn;
}

export function RoadmapSection({ onOpenForm }: RoadmapSectionProps) {
  return (
    <section className="section section--roadmap" id="alur">
      <div className="container">
        <div className="roadmap__grid">
          <div className="roadmap__content">
            <h2 className="section__title">
              Dari Bingung Arah Menuju Lebih Siap Menghadapi Dunia Kerja
            </h2>
            <p className="section__subtitle section__subtitle--roadmap">
              Webinar ini membantu Bapak/Ibu melihat gambaran sederhana perjalanan anak: mulai dari
              menemukan arah, mengenal skill digital, membuat karya, sampai lebih percaya diri
              menghadapi dunia kerja.
            </p>
            <button
              type="button"
              className="btn btn--primary roadmap__cta-desktop"
              onClick={() => onOpenForm('roadmap')}
            >
              Mulai dari Webinar Gratis
            </button>
          </div>

          <div className="roadmap__aside">
            <figure className="roadmap__visual">
              <img
                src="/roadmap-anak-siap-kerja.webp"
                alt="Roadmap: Bingung Arah, Skill Digital, Portofolio, hingga Lebih Siap Menghadapi Dunia Kerja"
                className="roadmap__image"
                width={540}
                height={960}
                loading="lazy"
              />
            </figure>

            <div className="roadmap__steps">
              {ROADMAP_STEPS.map((step) => (
                <div key={step.number} className="roadmap__step">
                  <span className="roadmap__step-number" aria-hidden="true">
                    {step.number}
                  </span>
                  <div className="roadmap__step-body">
                    <h3 className="roadmap__step-title">{step.title}</h3>
                    <p className="roadmap__step-text">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}