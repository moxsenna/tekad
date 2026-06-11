import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Printer, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/layout/Logo';
import { Footer } from '../components/layout/Footer';
import { trackLandingPageView } from '../lib/metaPixel';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
}

interface ChecklistCategory {
  title: string;
  items: ChecklistItem[];
}

const CHECKLIST_DATA: ChecklistCategory[] = [
  {
    title: '1. Mindset & Karakter (Kemandirian)',
    items: [
      {
        id: 'char_1',
        label: 'Kemandirian Belajar',
        description: 'Mampu mencari solusi mandiri di Google/YouTube saat bingung sebelum langsung bertanya.',
      },
      {
        id: 'char_2',
        label: 'Tanggung Jawab & Disiplin',
        description: 'Menyelesaikan tugas/kegiatan tepat waktu tanpa perlu terus-menerus diingatkan orang tua.',
      },
      {
        id: 'char_3',
        label: 'Daya Juang (Resilience)',
        description: 'Tidak mudah menyerah atau frustrasi saat menemui kendala/error ketika mencoba hal baru.',
      },
      {
        id: 'char_4',
        label: 'Inisiatif Eksplorasi',
        description: 'Punya kemauan sendiri untuk mengeksplorasi minat atau belajar keterampilan baru di luar sekolah.',
      },
      {
        id: 'char_5',
        label: 'Manajemen Waktu Produktif',
        description: 'Mampu membagi waktu antara hiburan (gaming/sosmed) dan kegiatan produktif belajar mandiri.',
      },
    ],
  },
  {
    title: '2. Skill Digital & AI (Teknologi)',
    items: [
      {
        id: 'tech_1',
        label: 'Dasar AI Tools',
        description: 'Biasa menggunakan ChatGPT/Claude secara produktif untuk riset, belajar, atau mencari ide.',
      },
      {
        id: 'tech_2',
        label: 'Operasional Laptop',
        description: 'Lancar mengoperasikan laptop (manajemen folder, mengetik 10 jari, navigasi browser).',
      },
      {
        id: 'tech_3',
        label: 'Google Docs & Sheets',
        description: 'Mengerti cara menyusun dokumen tulisan dan tabel laporan/grafik sederhana.',
      },
      {
        id: 'tech_4',
        label: 'Desain Visual Dasar',
        description: 'Bisa membuat desain/presentasi sederhana menggunakan Canva untuk kebutuhan komunikasi visual.',
      },
      {
        id: 'tech_5',
        label: 'Keamanan & Etika Digital',
        description: 'Paham dasar privasi online (sandi aman, waspada penipuan phishing) dan menjaga reputasi jejak digital.',
      },
    ],
  },
  {
    title: '3. Portofolio & Kehadiran Online (Karya)',
    items: [
      {
        id: 'port_1',
        label: 'CV Kreatif & Jelas',
        description: 'Memiliki CV satu halaman yang fokus pada potensi, skill, dan pencapaian (bukan sekadar daftar sekolah).',
      },
      {
        id: 'port_2',
        label: 'Profil LinkedIn Aktif',
        description: 'Memiliki profil LinkedIn aktif dengan foto profesional dan informasi minat karir yang jelas.',
      },
      {
        id: 'port_3',
        label: 'Portofolio Karya',
        description: 'Memiliki minimal 2-3 bukti karya nyata (tulisan, desain, coding, riset) yang tersimpan rapi.',
      },
      {
        id: 'port_4',
        label: 'Kerapian Berbagi Link',
        description: 'Paham cara share link Google Drive/portofolio dengan izin akses "Anyone with link can view".',
      },
      {
        id: 'port_5',
        label: 'Konsistensi Kehadiran Online',
        description: 'Punya akun portofolio/karya publik (seperti GitHub, Behance, Medium, atau akun khusus karya) yang diupdate dalam 3 bulan terakhir.',
      },
    ],
  },
  {
    title: '4. Komunikasi & Etika (Sopan Santun)',
    items: [
      {
        id: 'comm_1',
        label: 'Pesan Profesional (WhatsApp)',
        description: 'Bisa menyusun chat perkenalan yang sopan (salam, nama, keperluan, penutup) saat menghubungi orang baru.',
      },
      {
        id: 'comm_2',
        label: 'Etika Email',
        description: 'Mengerti cara menulis email lamaran kerja dengan Subject jelas, isi ringkas, dan lampiran yang benar.',
      },
      {
        id: 'comm_3',
        label: 'Komunikasi Lisan',
        description: 'Percaya diri saat memperkenalkan diri dan menceritakan minat karirnya di depan orang lain.',
      },
      {
        id: 'comm_4',
        label: 'Etika Pertemuan Online',
        description: 'Punya kebiasaan menyalakan kamera, berpakaian rapi, dan mematikan mic dengan tepat saat Zoom/Meet.',
      },
      {
        id: 'comm_5',
        label: 'Kerjasama Tim (Collaboration)',
        description: 'Mampu mendengarkan masukan, menerima kritik konstruktif, dan berdiskusi secara sehat dalam kelompok.',
      },
    ],
  },
];

export function BonusChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    trackLandingPageView('main'); // track PageView using main tracker
  }, []);

  const handleToggle = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalItems = useMemo(() => {
    return CHECKLIST_DATA.reduce((acc, cat) => acc + cat.items.length, 0);
  }, []);

  const score = useMemo(() => {
    return Object.values(checkedItems).filter(Boolean).length;
  }, [checkedItems]);

  const percentage = useMemo(() => {
    return Math.round((score / totalItems) * 100);
  }, [score, totalItems]);

  const assessmentResult = useMemo(() => {
    if (percentage <= 35) {
      return {
        status: 'Butuh Bimbingan Segera',
        color: 'text-error',
        bgColor: 'bg-error-light',
        icon: AlertCircle,
        desc: 'Anak Anda belum memiliki persiapan dasar yang cukup untuk bersaing di dunia kerja modern. Mereka berisiko tinggi bingung arah setelah lulus. Ikuti webinar kami untuk mempelajari cara membangun fondasi ini.',
      };
    }
    if (percentage <= 75) {
      return {
        status: 'Sedang Berkembang',
        color: 'text-warning',
        bgColor: 'bg-warning-light',
        icon: FileText,
        desc: 'Anak Anda sudah memiliki beberapa modal dasar kesiapan kerja, namun masih ada gap (celah) keterampilan digital dan etika komunikasi yang perlu dilengkapi agar mereka percaya diri melamar kerja.',
      };
    }
    return {
      status: 'Siap Bersaing (Kategori Unggul)',
      color: 'text-success',
      bgColor: 'bg-success-light',
      icon: CheckCircle2,
      desc: 'Luar biasa! Anak Anda memiliki kesiapan kerja yang sangat baik untuk anak seusianya. Fokus berikutnya adalah mempertajam skill khusus (AI & Digital Marketing) agar portofolio mereka menonjol.',
    };
  }, [percentage]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <header className="header print-hide">
        <div className="container header__inner">
          <a href="/" className="header__logo" aria-label="TEKAD — kembali ke webinar">
            <Logo className="logo--header" />
          </a>
          <a href="/" className="btn btn--secondary btn--sm affiliate-header__back">
            <ArrowLeft size={16} style={{ marginRight: '0.25rem' }} />
            Kembali ke Beranda
          </a>
        </div>
      </header>

      <main className="checklist-page">
        {/* Hero Banner Section */}
        <section className="checklist-hero section print-no-bg">
          <div className="container">
            <div className="checklist-hero__inner">
              <span className="checklist-hero__badge print-hide">EVALUASI MANDIRI GRATIS</span>
              <h1 className="checklist-hero__title">Checklist Kesiapan Kerja Anak</h1>
              <p className="checklist-hero__subtitle">
                Bantu Bapak/Ibu mengevaluasi tingkat kesiapan putra-putrinya menghadapi era kerja digital & AI. Centang setiap poin yang sudah dimiliki anak saat ini.
              </p>
              <div className="checklist-hero__actions print-hide">
                <button type="button" className="btn btn--secondary" onClick={handlePrint}>
                  <Printer size={18} style={{ marginRight: '0.5rem' }} />
                  Cetak / Simpan PDF
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Checklist Area */}
        <section className="section section--white">
          <div className="container">
            <div className="checklist-layout">
              {/* Left Column: Checklist Group */}
              <div className="checklist-groups">
                {CHECKLIST_DATA.map((category) => (
                  <div key={category.title} className="checklist-category-card">
                    <h2 className="checklist-category-title">{category.title}</h2>
                    <div className="checklist-items">
                      {category.items.map((item) => {
                        const isChecked = !!checkedItems[item.id];
                        return (
                          <label key={item.id} className={`checklist-item-card${isChecked ? ' checklist-item-card--checked' : ''}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggle(item.id)}
                              className="checklist-checkbox"
                            />
                            <div className="checklist-item-content">
                              <span className="checklist-item-label">{item.label}</span>
                              <span className="checklist-item-desc">{item.description}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Score Widget (Sticky on Desktop) */}
              <div className="checklist-sidebar">
                <div className="score-widget">
                  <span className="score-widget__badge">HASIL EVALUASI</span>
                  <div className="score-widget__gauge">
                    <span className="score-widget__percentage">{percentage}%</span>
                    <span className="score-widget__fraction">{score} dari {totalItems} terpenuhi</span>
                  </div>

                  <div className={`score-widget__result ${assessmentResult.bgColor}`}>
                    <div className="score-widget__status-row">
                      <assessmentResult.icon size={22} className={assessmentResult.color} />
                      <span className={`score-widget__status ${assessmentResult.color}`}>
                        {assessmentResult.status}
                      </span>
                    </div>
                    <p className="score-widget__desc">{assessmentResult.desc}</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
