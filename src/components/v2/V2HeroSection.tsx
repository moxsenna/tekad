import type { OpenFormFn } from '../../lib/metaPixel';
import { WEBINAR_HEADLINE, WEBINAR_SUBHEADLINE } from '../../lib/webinarCopy';

interface V2HeroSectionProps {
  onOpenForm: OpenFormFn;
}

const HERO_BULLETS = [
  'Anak masih bingung mau kuliah, kerja, atau mulai dari mana',
  'Sering pegang HP, tapi belum produktif',
  'Belum punya skill yang bisa ditunjukkan',
  'Belum punya portofolio',
  'Butuh arahan, tapi tidak mau dipaksa',
] as const;

export function V2HeroSection({ onOpenForm }: V2HeroSectionProps) {
  return (
    <section className="v2-hero" id="hero">
      <div className="container">
        <div className="v2-hero__grid">
          <div>
            <span className="v2-kicker">WEBINAR GRATIS UNTUK ORANG TUA</span>
            <h1 className="v2-hero__title">{WEBINAR_HEADLINE}</h1>
            <p className="v2-hero__subtitle">{WEBINAR_SUBHEADLINE}</p>
            <ul className="v2-list">
              {HERO_BULLETS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={() => onOpenForm('hero')}
            >
              Daftar Webinar Gratis
            </button>
            <p className="v2-microcopy">Gratis. Jadwal dan link webinar dikirim melalui WhatsApp.</p>
          </div>
          <figure>
            <img
              src="/hero-family-discussion.webp"
              alt="Orang tua mendampingi anak berdiskusi tentang masa depan"
              className="v2-hero__image"
              width={640}
              height={480}
            />
          </figure>
        </div>
      </div>
    </section>
  );
}