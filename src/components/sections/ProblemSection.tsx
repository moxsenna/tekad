import { Briefcase, HelpCircle, Smartphone, GraduationCap, HeartHandshake } from 'lucide-react';

const problems = [
  {
    icon: HelpCircle,
    title: 'Belum tahu arah',
    text: 'Anak mau lulus, tapi belum tahu mau ke mana.',
  },
  {
    icon: GraduationCap,
    title: 'Gap year / tidak lolos PTN',
    text: 'Tidak lolos PTN atau sedang gap year dan masih mencari jalan.',
  },
  {
    icon: Smartphone,
    title: 'HP belum produktif',
    text: 'Sering memakai HP, tapi belum diarahkan menjadi produktif.',
  },
  {
    icon: Briefcase,
    title: 'Belum punya skill',
    text: 'Ingin kerja, tapi belum punya skill dan portofolio.',
  },
  {
    icon: HeartHandshake,
    title: 'Orang tua bingung mendampingi',
    text: 'Ingin membantu, tapi takut salah mendampingi.',
  },
];

export function ProblemSection() {
  return (
    <section className="section section--cream" id="masalah">
      <div className="container">
        <h2 className="section__title">
          Banyak Anak Bukan Tidak Mampu, Mereka Hanya Belum Punya Arah
        </h2>
        <p className="section__subtitle section__subtitle--narrow">
          Setelah lulus sekolah atau kuliah, banyak anak belum langsung tahu jalan terbaiknya. Orang
          tua ingin membantu, tetapi sering bingung harus mulai dari mana.
        </p>
        <div className="problem-grid">
          {problems.map(({ icon: Icon, title, text }) => (
            <div key={title} className="problem-card">
              <div className="problem-card__icon">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="problem-card__title">{title}</h3>
                <p className="problem-card__text">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}