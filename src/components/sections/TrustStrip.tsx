const badges = [
  'LPK TEKAD',
  'Digital Marketing & AI',
  'Praktik Langsung',
  'Portofolio',
  'Sertifikat',
  'Pendampingan',
];

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Keunggulan LPK TEKAD">
      <div className="container">
        <div className="trust-strip__inner">
          {badges.map((badge, i) => (
            <span key={badge} className="trust-strip__badge">
              {i > 0 && <span className="trust-strip__dot" aria-hidden="true" />}
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}