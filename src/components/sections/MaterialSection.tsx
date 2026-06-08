const materials = [
  {
    title: 'Realita Dunia Kerja Digital & AI',
    text: 'Mengapa anak perlu mulai mengenal skill praktis, bukan hanya mengandalkan ijazah.',
  },
  {
    title: 'Skill dan Portofolio dari Nol',
    text: 'Contoh skill digital, AI, konten, media sosial, dan karya sederhana yang bisa mulai dibangun.',
  },
  {
    title: 'Cara Orang Tua Mendampingi',
    text: 'Cara memberi arah, dukungan, dan komunikasi yang lebih sehat tanpa memaksa anak.',
  },
];

export function MaterialSection() {
  return (
    <section className="section section--cream" id="materi">
      <div className="container">
        <h2 className="section__title">Apa yang Akan Dibahas di Webinar?</h2>
        <div className="material-blocks">
          {materials.map((item, i) => (
            <div key={item.title} className="material-block">
              <span className="material-block__num">{i + 1}</span>
              <div>
                <h3 className="material-block__title">{item.title}</h3>
                <p className="material-block__text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="material-note">
          Termasuk gambaran langkah awal untuk membangun kebiasaan produktif dan portofolio anak.
        </p>
      </div>
    </section>
  );
}