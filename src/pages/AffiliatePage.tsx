import { useCallback, useState } from 'react';
import { Check, Copy, MessageCircle, Share2 } from 'lucide-react';
import { Logo } from '../components/layout/Logo';
import { Footer } from '../components/layout/Footer';
import { copyTextToClipboard } from '../lib/clipboard';
import { validateAffiliateForm } from '../lib/affiliateValidation';
import { submitAffiliate } from '../lib/submitAffiliate';
import type { AffiliateFormData, AffiliateSuccessResponse } from '../types/affiliate';

const INITIAL_FORM: AffiliateFormData = {
  nama: '',
  whatsapp: '',
  kota: '',
  email: '',
  profesi: '',
  media_sosial: '',
  rekening: '',
  nama_rekening: '',
  agree_terms: false,
};

const BENEFITS = [
  'Gratis daftar',
  'Dapat link promosi pribadi',
  'Komisi per peserta yang berhasil closing',
  'Materi promosi bisa dibagikan ke WhatsApp/grup',
  'Komisi dibayar manual setelah validasi',
];

const STEPS = [
  'Daftar sebagai affiliate',
  'Dapat link promosi pribadi',
  'Share ke orang tua/komunitas',
  'Lead masuk ke sistem TEKAD',
  'Jika peserta membayar, komisi dicatat dan dibayar manual',
];

const RULES = [
  'Komisi hanya untuk peserta yang benar-benar membayar.',
  'Data lead diverifikasi admin TEKAD.',
  'Dilarang membuat klaim berlebihan.',
  'Dilarang menjanjikan pekerjaan instan.',
  'Pembayaran komisi dilakukan manual sesuai jadwal TEKAD.',
];

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';
type CopyTarget = 'link' | 'caption' | null;

export function AffiliatePage() {
  const [form, setForm] = useState<AffiliateFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<AffiliateSuccessResponse | null>(null);
  const [copyTarget, setCopyTarget] = useState<CopyTarget>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const updateField = useCallback(
    <K extends keyof AffiliateFormData>(field: K, value: AffiliateFormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationError = validateAffiliateForm(form);
      if (validationError) {
        setError(validationError);
        setStatus('error');
        return;
      }

      setStatus('loading');
      setError(null);

      const result = await submitAffiliate(form);

      if ('ok' in result && result.ok) {
        setSuccess(result);
        setStatus('success');
        return;
      }

      setStatus('error');
      setError(
        'message' in result && result.message
          ? result.message
          : 'Pendaftaran belum berhasil. Periksa koneksi atau coba lagi beberapa saat.'
      );
    },
    [form]
  );

  const handleCopy = useCallback(async (target: CopyTarget, text: string) => {
    setCopyFeedback(null);
    const copied = await copyTextToClipboard(text);
    if (copied) {
      setCopyTarget(target);
      window.setTimeout(() => setCopyTarget(null), 2500);
      return;
    }
    setCopyFeedback('Gagal menyalin. Silakan salin manual dari kotak teks.');
    window.setTimeout(() => setCopyFeedback(null), 4000);
  }, []);

  const handleShareWhatsApp = useCallback(() => {
    if (!success?.caption) return;
    const url = `https://wa.me/?text=${encodeURIComponent(success.caption)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [success]);

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <a href="/" className="header__logo" aria-label="TEKAD — kembali ke webinar">
            <Logo className="logo--header" />
          </a>
          <a href="/" className="btn btn--secondary btn--sm affiliate-header__back">
            Kembali ke Webinar
          </a>
        </div>
      </header>

      <main className="affiliate-page">
        <section className="affiliate-hero section">
          <div className="container affiliate-hero__inner">
            <span className="affiliate-hero__eyebrow">Program Mitra TEKAD</span>
            <h1 className="affiliate-hero__title">Jadi Mitra Affiliate TEKAD</h1>
            <p className="affiliate-hero__subtitle">
              Bantu orang tua menemukan jalur keterampilan digital dan AI untuk anaknya, lalu
              dapatkan komisi untuk setiap peserta yang berhasil mendaftar melalui link Anda.
            </p>
          </div>
        </section>

        <section className="section section--cream">
          <div className="container">
            <h2 className="section__title">Manfaat Menjadi Affiliate</h2>
            <ul className="affiliate-benefits">
              {BENEFITS.map((item) => (
                <li key={item} className="affiliate-benefits__item">
                  <Check size={18} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2 className="section__title">Cara Kerjanya</h2>
            <ol className="affiliate-steps">
              {STEPS.map((step, index) => (
                <li key={step} className="affiliate-steps__item">
                  <span className="affiliate-steps__num">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section--cream" id="daftar-affiliate">
          <div className="container affiliate-form-section">
            <h2 className="section__title">Daftar & Buat Link Affiliate</h2>
            <p className="section__subtitle section__subtitle--narrow">
              Isi data di bawah ini. Setelah berhasil, Anda langsung mendapat kode dan link promosi
              pribadi.
            </p>

            {status === 'success' && success ? (
              <div className="affiliate-success" role="status">
                <h3 className="affiliate-success__title">Pendaftaran Berhasil</h3>
                <p className="affiliate-success__label">Kode Affiliate Anda</p>
                <p className="affiliate-success__code">{success.kode_ref}</p>

                <p className="affiliate-success__label">Link Promosi Anda</p>
                <div className="affiliate-success__link-box">
                  <a href={success.link_ref} target="_blank" rel="noopener noreferrer">
                    {success.link_ref}
                  </a>
                </div>

                <div className="affiliate-success__actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => handleCopy('link', success.link_ref)}
                  >
                    <Copy size={18} aria-hidden="true" />
                    Copy Link
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => handleCopy('caption', success.caption)}
                  >
                    <Copy size={18} aria-hidden="true" />
                    Copy Caption Promosi
                  </button>
                  <button type="button" className="btn btn--navy" onClick={handleShareWhatsApp}>
                    <Share2 size={18} aria-hidden="true" />
                    Share ke WhatsApp
                  </button>
                </div>

                {copyTarget === 'link' && (
                  <p className="affiliate-copy-status">Link berhasil disalin.</p>
                )}
                {copyTarget === 'caption' && (
                  <p className="affiliate-copy-status">Caption berhasil disalin.</p>
                )}
                {copyFeedback && (
                  <p className="affiliate-copy-status affiliate-copy-status--error" role="alert">
                    {copyFeedback}
                  </p>
                )}

                <details className="affiliate-caption-preview">
                  <summary>Lihat caption promosi</summary>
                  <pre>{success.caption}</pre>
                </details>
              </div>
            ) : (
              <form className="affiliate-form" onSubmit={handleSubmit} noValidate>
                <div className="affiliate-form__grid">
                  <label className="affiliate-field">
                    <span className="affiliate-field__label">Nama lengkap *</span>
                    <input
                      type="text"
                      className="form-input"
                      value={form.nama}
                      onChange={(e) => updateField('nama', e.target.value)}
                      placeholder="Contoh: Bima Senna"
                      autoComplete="name"
                    />
                  </label>

                  <label className="affiliate-field">
                    <span className="affiliate-field__label">WhatsApp *</span>
                    <input
                      type="tel"
                      className="form-input"
                      value={form.whatsapp}
                      onChange={(e) => updateField('whatsapp', e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      autoComplete="tel"
                    />
                  </label>

                  <label className="affiliate-field">
                    <span className="affiliate-field__label">Kota *</span>
                    <input
                      type="text"
                      className="form-input"
                      value={form.kota}
                      onChange={(e) => updateField('kota', e.target.value)}
                      placeholder="Contoh: Cirebon"
                    />
                  </label>
                </div>

                <div className="affiliate-form__optional">
                  <p className="affiliate-form__optional-title">Data tambahan (opsional)</p>
                  <div className="affiliate-form__grid">
                    <label className="affiliate-field">
                      <span className="affiliate-field__label">Email</span>
                      <input
                        type="email"
                        className="form-input"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="nama@email.com"
                        autoComplete="email"
                      />
                    </label>

                    <label className="affiliate-field">
                      <span className="affiliate-field__label">Profesi / komunitas</span>
                      <input
                        type="text"
                        className="form-input"
                        value={form.profesi}
                        onChange={(e) => updateField('profesi', e.target.value)}
                        placeholder="Contoh: Komunitas Orang Tua"
                      />
                    </label>

                    <label className="affiliate-field">
                      <span className="affiliate-field__label">Akun media sosial</span>
                      <input
                        type="url"
                        className="form-input"
                        value={form.media_sosial}
                        onChange={(e) => updateField('media_sosial', e.target.value)}
                        placeholder="https://instagram.com/..."
                      />
                    </label>

                    <label className="affiliate-field">
                      <span className="affiliate-field__label">Nomor rekening / e-wallet</span>
                      <input
                        type="text"
                        className="form-input"
                        value={form.rekening}
                        onChange={(e) => updateField('rekening', e.target.value)}
                        placeholder="Contoh: 1234567890"
                      />
                    </label>

                    <label className="affiliate-field affiliate-field--full">
                      <span className="affiliate-field__label">Nama pemilik rekening</span>
                      <input
                        type="text"
                        className="form-input"
                        value={form.nama_rekening}
                        onChange={(e) => updateField('nama_rekening', e.target.value)}
                        placeholder="Sesuai nama di rekening"
                      />
                    </label>
                  </div>
                </div>

                <div className="affiliate-rules">
                  <h3 className="affiliate-rules__title">Aturan Affiliate</h3>
                  <ul className="affiliate-rules__list">
                    {RULES.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </div>

                <label className="affiliate-consent">
                  <input
                    type="checkbox"
                    checked={form.agree_terms}
                    onChange={(e) => updateField('agree_terms', e.target.checked)}
                  />
                  <span>
                    Saya memahami bahwa komisi hanya diberikan untuk peserta yang benar-benar
                    membayar, data lead diverifikasi admin TEKAD, dan pembayaran komisi dilakukan
                    manual sesuai jadwal TEKAD.
                  </span>
                </label>

                {error && (
                  <div className="form-error affiliate-form__error" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={`btn btn--primary btn--lg affiliate-form__submit${status === 'loading' ? ' btn--loading' : ''}`}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Mendaftar…' : 'Daftar & Buat Link Affiliate'}
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="affiliate-note section">
          <div className="container">
            <div className="affiliate-note__card">
              <MessageCircle size={20} aria-hidden="true" />
              <p>
                Butuh bantuan? Hubungi admin TEKAD melalui WhatsApp setelah mendaftar. Kami akan
                membantu Anda memulai promosi dengan aman dan sesuai aturan.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}