const benefits = [
  'Memahami kenapa banyak anak belum siap kerja.',
  'Mengetahui skill digital dan AI yang bisa dipelajari dari nol.',
  'Mendapat gambaran peta 90 hari membangun kesiapan kerja anak.',
  'Mengetahui contoh portofolio yang bisa dibuat anak.',
  'Memahami cara mendampingi anak tanpa memaksa.',
  'Mendapat checklist kesiapan kerja anak.',
  'Berkesempatan konsultasi kondisi anak.',
];

export function BenefitSection() {
  return (
    <section className="section section--cream" id="manfaat">
      <div className="container">
        <h2 className="section__title">Apa yang Akan Bapak/Ibu Dapatkan di Webinar Ini?</h2>
        <p className="section__subtitle">
          Di webinar ini, Bapak/Ibu akan belajar cara membantu anak lebih siap menghadapi dunia
          kerja di era digital dan AI.
        </p>
        <div className="benefit-grid">
          {benefits.map((text, i) => (
            <div key={text} className="benefit-card">
              <span className="benefit-card__number">{i + 1}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}