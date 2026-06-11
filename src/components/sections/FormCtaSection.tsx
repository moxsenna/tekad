import type { OpenFormFn } from '../../lib/metaPixel';

interface FormCtaSectionProps {
  onOpenForm: OpenFormFn;
}

export function FormCtaSection({ onOpenForm }: FormCtaSectionProps) {
  return (
    <section className="cta-section" id="daftar">
      <div className="container">
        <h2 className="cta-section__title">Daftar Webinar Gratis Sekarang</h2>
        <p className="cta-section__subtitle">
          Isi data singkat agar tim TEKAD dapat mengirim jadwal webinar, link masuk, dan checklist
          kesiapan kerja anak melalui WhatsApp.
        </p>
        <button
          type="button"
          className="btn btn--primary btn--lg"
          onClick={() => onOpenForm('final')}
        >
          Daftar Webinar Gratis via WhatsApp
        </button>
        <p className="cta-section__microcopy">Proses daftar kurang dari 2 menit.</p>
        <div className="disclaimer-card">
          <p>
            <strong>Catatan:</strong> webinar ini tidak menjanjikan anak pasti langsung bekerja atau
            memperoleh penghasilan tertentu. Fokus webinar adalah membantu orang tua memahami arah,
            skill, portofolio, dan langkah awal yang lebih realistis untuk menyiapkan anak menghadapi
            dunia kerja.
          </p>
        </div>
      </div>
    </section>
  );
}