import { Award, BookOpen, Briefcase, Users } from 'lucide-react';

const trustItems = [
  { icon: BookOpen, text: 'Fokus praktik langsung' },
  { icon: Users, text: 'Mentor/instruktur praktisi' },
  { icon: Briefcase, text: 'Kurikulum digital marketing dan AI' },
  { icon: Award, text: 'Portofolio nyata & sertifikat' },
];

export function TekadSection() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section__title">Tentang LPK TEKAD</h2>
        <p className="section__subtitle">
          LPK TEKAD adalah lembaga pelatihan yang berfokus pada penguatan keterampilan bisnis,
          digital marketing, AI, social media marketing, dan content creation. Program TEKAD
          mengutamakan praktik langsung, pendampingan, portofolio nyata, sertifikat, serta
          orientasi karir dan bisnis.
        </p>
        <div className="trust-grid">
          {trustItems.map(({ icon: Icon, text }) => (
            <div key={text} className="trust-item">
              <Icon size={22} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}