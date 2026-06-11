const BENEFITS = [
  'Cara membaca kondisi anak yang masih bingung arah',
  'Skill digital dan AI yang realistis dipelajari dari nol',
  'Cara mengubah HP menjadi alat belajar dan berkarya',
  'Contoh portofolio awal yang bisa dibuat anak',
  'Cara mendampingi anak tanpa memaksa',
] as const;

export function V2BenefitSection() {
  return (
    <section className="v2-section v2-section--cream" id="manfaat">
      <div className="container">
        <h2 className="v2-section__title">Setelah Webinar, Bapak/Ibu Akan Lebih Paham:</h2>
        <ul className="v2-list">
          {BENEFITS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="v2-section__body">
          <p>Bukan sekadar motivasi.</p>
          <p>Bapak/Ibu pulang dengan gambaran langkah awal yang lebih jelas.</p>
        </div>
      </div>
    </section>
  );
}