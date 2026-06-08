const MATERIALS = [
  {
    title: 'Realita Dunia Kerja Era AI',
    text: 'Kenapa anak perlu mulai punya skill praktis, bukan hanya menunggu kesempatan.',
  },
  {
    title: 'Skill Digital dari Nol',
    text: 'Gambaran skill seperti AI, konten, desain, media sosial, dan digital marketing.',
  },
  {
    title: 'Portofolio Awal Anak',
    text: 'Contoh karya sederhana yang bisa menjadi bukti kemampuan anak.',
  },
  {
    title: 'Cara Mendampingi Anak',
    text: 'Cara memberi arah tanpa memaksa atau membuat anak tertekan.',
  },
] as const;

export function V2MaterialSection() {
  return (
    <section className="v2-section v2-section--cream" id="materi">
      <div className="container">
        <h2 className="v2-section__title">Apa yang Dibahas?</h2>
        <div className="v2-cards v2-cards--two">
          {MATERIALS.map((item, index) => (
            <div key={item.title} className="v2-card">
              <h3 className="v2-card__title">
                {index + 1}. {item.title}
              </h3>
              <p className="v2-card__text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}