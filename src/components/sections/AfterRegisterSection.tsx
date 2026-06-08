import { ClipboardList, MessageCircle, Video, Users } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    title: 'Isi form singkat',
    text: 'Jawab beberapa pertanyaan singkat tentang kondisi anak.',
  },
  {
    icon: MessageCircle,
    title: 'Tim TEKAD mengirim jadwal',
    text: 'Jadwal dan link webinar dikirim melalui WhatsApp.',
  },
  {
    icon: Video,
    title: 'Ikuti webinar gratis',
    text: 'Bapak/Ibu mengikuti webinar online tanpa biaya.',
  },
  {
    icon: Users,
    title: 'Konsultasi jika berkenan',
    text: 'Setelah webinar, Bapak/Ibu bisa konsultasi kondisi anak jika mau.',
  },
];

export function AfterRegisterSection() {
  return (
    <section className="section" id="setelah-daftar">
      <div className="container">
        <h2 className="section__title">Setelah Daftar, Apa yang Terjadi?</h2>
        <p className="section__subtitle section__subtitle--narrow">
          Bapak/Ibu tidak akan langsung diarahkan membeli program. Tim TEKAD akan mengirim informasi
          webinar dan membantu menjelaskan langkah berikutnya melalui WhatsApp.
        </p>
        <div className="timeline">
          {steps.map((step, i) => (
            <div key={step.title} className="timeline__item">
              <div className="timeline__marker">
                <step.icon size={20} aria-hidden="true" />
                <span className="timeline__num">{i + 1}</span>
              </div>
              <div className="timeline__content">
                <h3 className="timeline__title">{step.title}</h3>
                <p className="timeline__text">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="after-register-note">
          Nomor WhatsApp hanya digunakan untuk informasi webinar dan follow-up konsultasi TEKAD.
        </p>
      </div>
    </section>
  );
}