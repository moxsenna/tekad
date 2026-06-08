interface FormCtaSectionProps {
  onOpenForm: () => void;
}

export function FormCtaSection({ onOpenForm }: FormCtaSectionProps) {
  return (
    <section className="cta-section" id="daftar">
      <div className="container">
        <h2 className="cta-section__title">Daftar Webinar Gratis Sekarang</h2>
        <p className="cta-section__subtitle">
          Isi data singkat berikut agar tim TEKAD dapat mengirimkan informasi jadwal webinar
          melalui WhatsApp.
        </p>
        <button type="button" className="btn btn--primary" onClick={onOpenForm}>
          Mulai Daftar
        </button>
      </div>
    </section>
  );
}