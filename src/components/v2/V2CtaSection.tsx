import type { OpenFormFn } from '../../lib/metaPixel';

interface V2CtaSectionProps {
  onOpenForm: OpenFormFn;
}

export function V2CtaSection({ onOpenForm }: V2CtaSectionProps) {
  return (
    <section className="v2-cta" id="daftar">
      <div className="container">
        <h2 className="v2-cta__title">Daftar Webinar Gratis Sekarang</h2>
        <p className="v2-cta__subtitle">
          Isi data singkat agar tim TEKAD bisa mengirim jadwal webinar, link masuk, dan checklist
          kesiapan kerja anak melalui WhatsApp.
        </p>
        <button
          type="button"
          className="btn btn--primary btn--lg"
          onClick={() => onOpenForm('final')}
        >
          Daftar Webinar Gratis via WhatsApp
        </button>
        <p className="v2-microcopy">Proses daftar kurang dari 2 menit.</p>
        <div className="v2-disclaimer">
          Webinar ini tidak menjanjikan anak pasti langsung bekerja atau mendapat penghasilan
          tertentu. Fokusnya adalah membantu orang tua memahami arah, skill, portofolio, dan langkah
          awal yang lebih realistis.
        </div>
      </div>
    </section>
  );
}