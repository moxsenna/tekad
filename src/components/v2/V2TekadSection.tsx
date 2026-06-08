const FOCUS = [
  'Digital Marketing & AI',
  'Praktik langsung',
  'Mentor/instruktur',
  'Portofolio nyata',
  'Sertifikat',
  'Orientasi karir dan bisnis',
] as const;

export function V2TekadSection() {
  return (
    <section className="v2-section v2-section--cream" id="tentang">
      <div className="container">
        <h2 className="v2-section__title">Tentang LPK TEKAD</h2>
        <div className="v2-section__body">
          <p>
            LPK TEKAD berfokus pada pelatihan digital marketing, AI, social media marketing,
            content creation, dan keterampilan bisnis.
          </p>
          <p>
            Pembelajaran menekankan praktik langsung, pendampingan, portofolio, sertifikat, serta
            orientasi karir dan bisnis.
          </p>
        </div>
        <p className="v2-section__title" style={{ fontSize: '1rem', marginTop: '1.25rem' }}>
          Fokus TEKAD:
        </p>
        <ul className="v2-focus-list">
          {FOCUS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}