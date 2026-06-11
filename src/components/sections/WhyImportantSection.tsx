import { AlertCircle } from 'lucide-react';

export function WhyImportantSection() {
  return (
    <section className="section section--white" id="mengapa-penting">
      <div className="container">
        <div className="why-important__inner">
          <div className="why-important__icon-wrapper">
            <AlertCircle size={28} className="why-important__icon" aria-hidden="true" />
          </div>
          <h2 className="section__title">Kenapa Webinar Ini Penting untuk Orang Tua?</h2>
          <div className="why-important__content">
            <p>
              Karena dunia kerja anak kita sudah berubah. Ijazah tetap penting, tetapi anak juga perlu
              <strong> skill praktis, kemampuan menggunakan teknologi, dan karya nyata</strong> yang bisa ditunjukkan.
            </p>
            <p>
              Di webinar ini, Bapak/Ibu akan mendapat gambaran sederhana tentang cara mendampingi anak
              mengenal skill digital & AI tanpa membuat anak merasa dipaksa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
