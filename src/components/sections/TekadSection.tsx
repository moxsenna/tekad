import { Award, BookOpen, Briefcase, Cpu, FileCheck, Users } from 'lucide-react';

const trustCards = [
  { icon: Cpu, text: 'Digital Marketing & AI' },
  { icon: BookOpen, text: 'Praktik Langsung' },
  { icon: Users, text: 'Mentor/Instruktur' },
  { icon: Briefcase, text: 'Portofolio Nyata' },
  { icon: Award, text: 'Sertifikat' },
  { icon: FileCheck, text: 'Career/Business Orientation' },
];

export function TekadSection() {
  return (
    <section className="section section--cream" id="tentang">
      <div className="container">
        <h2 className="section__title">Tentang LPK TEKAD</h2>
        <p className="section__subtitle section__subtitle--narrow">
          LPK TEKAD adalah lembaga pelatihan yang berfokus pada penguatan keterampilan bisnis,
          digital marketing, AI, social media marketing, dan content creation. Pembelajaran
          menekankan praktik langsung, pendampingan, portofolio nyata, sertifikat, serta orientasi
          karir dan bisnis.
        </p>
        <div className="trust-grid">
          {trustCards.map(({ icon: Icon, text }) => (
            <div key={text} className="trust-card">
              <Icon size={20} aria-hidden="true" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}