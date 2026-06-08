import { Calendar, Clock, Gift, MapPin, Video } from 'lucide-react';
import type { OpenFormFn } from '../../lib/metaPixel';
import { WEBINAR_HEADLINE, WEBINAR_SUBHEADLINE, WEBINAR_THEME } from '../../lib/webinarCopy';

interface HeroSectionProps {
  onOpenForm: OpenFormFn;
}

export function HeroSection({ onOpenForm }: HeroSectionProps) {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__copy">
            <div className="hero__lead">
              <span className="hero__eyebrow">WEBINAR GRATIS UNTUK ORANG TUA</span>
              <h1 className="hero__title">{WEBINAR_HEADLINE}</h1>
              <p className="hero__subtitle">{WEBINAR_SUBHEADLINE}</p>
            </div>
            <div className="hero__rest">
              <div className="hero__actions">
                <button
                  type="button"
                  className="btn btn--primary btn--lg"
                  onClick={() => onOpenForm('hero')}
                >
                  Daftar Webinar Gratis
                </button>
                <a href="#alur" className="btn btn--secondary btn--lg">
                  Lihat Alurnya
                </a>
              </div>
              <p className="hero__microcopy">
                Gratis. Jadwal dan link webinar dikirim melalui WhatsApp. Tidak wajib langsung
                mendaftar program.
              </p>
              <div className="event-card">
                <div className="event-card__item">
                  <Video size={18} aria-hidden="true" />
                  <span>Webinar Online Gratis</span>
                </div>
                <div className="event-card__item">
                  <Calendar size={18} aria-hidden="true" />
                  <span>Tema: {WEBINAR_THEME}</span>
                </div>
                <div className="event-card__item">
                  <Calendar size={18} aria-hidden="true" />
                  <span>Hari: Minggu, 21 Juni 2026</span>
                </div>
                <div className="event-card__item">
                  <Clock size={18} aria-hidden="true" />
                  <span>Jam: 19:00 WIB</span>
                </div>
                <div className="event-card__item">
                  <MapPin size={18} aria-hidden="true" />
                  <span>Tempat: Online</span>
                </div>
                <div className="event-card__item event-card__item--bonus">
                  <Gift size={18} aria-hidden="true" />
                  <span>Bonus: Checklist Kesiapan Kerja Anak</span>
                </div>
              </div>
            </div>
          </div>

          <figure className="hero__visual">
            <img
              src="/hero-family-discussion.webp"
              alt="Orang tua mendampingi anak berdiskusi tentang masa depan dengan laptop dan smartphone"
              className="hero__image"
              width={640}
              height={480}
            />
          </figure>

          <ul className="bullet-list hero__bullets">
            <li>
              Untuk orang tua anak SMA/SMK, gap year, mahasiswa, fresh graduate, atau belum
              bekerja
            </li>
            <li>Membantu anak menemukan arah tanpa dipaksa</li>
            <li>Mengenalkan skill digital dan AI yang realistis dari nol</li>
            <li>Ada sesi tanya jawab dan kesempatan konsultasi kondisi anak</li>
          </ul>
        </div>
      </div>
    </section>
  );
}