const STEPS = [
  {
    title: 'Isi form singkat',
    text: 'Ayah/Bunda mengisi nama, WhatsApp, dan kondisi anak.',
  },
  {
    title: 'Tim TEKAD mengirim info webinar',
    text: 'Jadwal dan link dikirim melalui WhatsApp.',
  },
  {
    title: 'Ikut webinar gratis',
    text: 'Ayah/Bunda mendapat gambaran arah, skill, dan langkah awal untuk anak.',
  },
  {
    title: 'Bisa konsultasi',
    text: 'Jika berkenan, Ayah/Bunda bisa diskusi kondisi anak setelah webinar.',
  },
] as const;

export function V2AfterRegisterSection() {
  return (
    <section className="v2-section" id="setelah-daftar">
      <div className="container">
        <h2 className="v2-section__title">Setelah Daftar, Apa yang Terjadi?</h2>
        <div className="v2-steps">
          {STEPS.map((step, index) => (
            <div key={step.title} className="v2-step">
              <span className="v2-step__num" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h3 className="v2-step__title">{step.title}</h3>
                <p className="v2-step__text">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="v2-microcopy" style={{ marginTop: '1rem' }}>
          Nomor WhatsApp hanya digunakan untuk informasi webinar dan follow-up TEKAD.
        </p>
      </div>
    </section>
  );
}