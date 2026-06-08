import { Users } from 'lucide-react';

interface HeroSectionProps {
  onOpenForm: () => void;
}

export function HeroSection({ onOpenForm }: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="hero__badge">Webinar Gratis</span>
          <h1 className="hero__title">Dari Bingung Arah Menjadi Siap Kerja</h1>
          <p className="hero__subtitle">
            Webinar gratis untuk orang tua yang ingin membantu anak setelah SMA/SMK/kuliah agar
            punya arah, skill praktis, dan lebih percaya diri menghadapi dunia kerja di era digital
            dan AI.
          </p>
          <ul className="bullet-list hero__bullets">
            <li>
              Cocok untuk orang tua anak SMA/SMK, mahasiswa, fresh graduate, atau gap year.
            </li>
            <li>Bahas peta 90 hari membangun skill digital dan AI dari nol.</li>
            <li>
              Dapatkan gambaran portofolio yang bisa membantu anak lebih percaya diri.
            </li>
            <li>Ada sesi tanya jawab dan kesempatan konsultasi.</li>
          </ul>
          <div className="hero__actions">
            <button type="button" className="btn btn--primary" onClick={onOpenForm}>
              Daftar Webinar Gratis
            </button>
            <a href="#manfaat" className="btn btn--secondary">
              Lihat Manfaat Webinar
            </a>
          </div>
          <p className="hero__microcopy">Gratis. Link webinar akan dikirim melalui WhatsApp.</p>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__visual-placeholder">
            <Users size={64} strokeWidth={1.5} />
            <p>Orang tua dan anak muda belajar bersama menuju masa depan yang lebih siap kerja</p>
          </div>
        </div>
      </div>
    </section>
  );
}