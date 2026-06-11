import { ShieldCheck } from 'lucide-react';

export function SpeakerSection() {
  return (
    <section className="section section--cream" id="speaker">
      <div className="container">
        <div className="speaker-section__card">
          <div className="speaker-section__icon-wrapper">
            <ShieldCheck size={36} className="speaker-section__icon" aria-hidden="true" />
          </div>
          <div className="speaker-section__info">
            <h2 className="section__title speaker-section__title">Dipandu oleh Tim TEKAD</h2>
            <p className="speaker-section__text">
              Webinar ini dibawakan oleh tim TEKAD yang berfokus pada pelatihan digital marketing, AI,
              content creation, dan pendampingan skill praktis untuk anak muda.
            </p>
            <p className="speaker-section__highlight">
              Fokus webinar bukan menakut-nakuti orang tua, tetapi memberi peta sederhana agar anak bisa
              mulai punya arah.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
