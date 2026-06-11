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
        <div className="section__subtitle section__subtitle--narrow" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          <p>
            LPK TEKAD berfokus pada pelatihan keterampilan digital, AI, marketing, content creation, dan pengembangan karier/bisnis.
          </p>
          <p>
            Program pembelajaran TEKAD diarahkan agar relevan dengan kebutuhan industri dan kompetensi kerja modern.
          </p>
        </div>
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