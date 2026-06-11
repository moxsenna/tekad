import { BookOpen, Target, Heart } from 'lucide-react';

const commitments = [
  {
    icon: Target,
    title: 'Kurikulum Relevan Industri',
    text: 'Materi pembelajaran berfokus pada keahlian praktis digital dan teknologi AI yang nyata dibutuhkan di era kerja modern saat ini.',
  },
  {
    icon: BookOpen,
    title: 'Fokus pada Portofolio Karya',
    text: 'Anak diarahkan untuk langsung praktek membuat karya nyata sebagai portofolio kemampuan, bukan sekadar menghafalkan materi teori.',
  },
  {
    icon: Heart,
    title: 'Pendampingan yang Empatis',
    text: 'Membantu orang tua membangun komunikasi yang lebih sehat dalam mengarahkan potensi dan minat anak tanpa menimbulkan rasa tertekan.',
  },
];

export function CommitmentSection() {
  return (
    <section className="section" id="komitmen">
      <div className="container">
        <h2 className="section__title">3 Komitmen Pendampingan TEKAD</h2>
        <p className="section__subtitle section__subtitle--narrow">
          Mempersiapkan masa depan anak tidak harus dengan menebak-nebak. LPK TEKAD berfokus pada tiga pilar utama untuk membantu anak menemukan arah karirnya secara nyata.
        </p>
        <div className="commitment-grid">
          {commitments.map(({ icon: Icon, title, text }) => (
            <div key={title} className="commitment-card">
              <div className="commitment-card__icon">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="commitment-card__title">{title}</h3>
              <p className="commitment-card__text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
