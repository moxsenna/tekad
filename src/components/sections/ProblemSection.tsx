import { HelpCircle } from 'lucide-react';

const problems = [
  'Anak sudah mau lulus, tapi belum tahu mau ke mana.',
  'Anak ingin kerja, tapi belum punya skill dan portofolio.',
  'Anak sering memakai HP, tapi belum diarahkan menjadi produktif.',
  'Orang tua ingin membantu, tapi bingung harus mulai dari mana.',
  'Kuliah penting, tapi skill kerja praktis juga perlu disiapkan.',
];

export function ProblemSection() {
  return (
    <section className="section section--cream" id="masalah">
      <div className="container">
        <h2 className="section__title">Apakah Bapak/Ibu Pernah Merasakan Ini?</h2>
        <p className="section__subtitle">
          Banyak anak bukan tidak mampu, mereka hanya belum punya arah. Setelah lulus sekolah
          atau kuliah, banyak anak masih bingung harus mulai dari mana.
        </p>
        <div className="problem-list">
          {problems.map((text) => (
            <div key={text} className="problem-item">
              <div className="problem-item__icon">
                <HelpCircle size={20} />
              </div>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}