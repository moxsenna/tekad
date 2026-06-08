import { Calendar, Gift, MessageCircle, Video } from 'lucide-react';

interface HeroSectionProps {
  onOpenForm: () => void;
}

export function HeroSection({ onOpenForm }: HeroSectionProps) {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__copy">
            <div className="hero__lead">
              <span className="hero__eyebrow">Webinar Gratis untuk Orang Tua</span>
              <p className="hero__hook">
                Satu langkah Bapak/Ibu hari ini bisa menjadi awal anak lebih siap menghadapi masa
                depannya.
              </p>
              <h1 className="hero__title">
                Anak Masih Bingung Arah? Bantu Ia Menemukan Arah, Membangun Skill, dan Lebih
                Percaya Diri
              </h1>
              <p className="hero__subtitle">
                Webinar gratis untuk orang tua yang ingin membantu anak setelah SMA/SMK/kuliah agar
                mulai punya arah, skill praktis, dan lebih siap menghadapi dunia kerja di era
                digital dan AI.
              </p>
            </div>
            <div className="hero__rest">
              <div className="hero__actions">
                <button type="button" className="btn btn--primary btn--lg" onClick={onOpenForm}>
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
                  <span>Tema: Dari Bingung Arah Menjadi Siap Kerja</span>
                </div>
                <div className="event-card__item">
                  <Video size={18} aria-hidden="true" />
                  <span>Durasi: 90 menit</span>
                </div>
                <div className="event-card__item">
                  <MessageCircle size={18} aria-hidden="true" />
                  <span>Link dikirim melalui WhatsApp</span>
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