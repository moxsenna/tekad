import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { TrackingData } from '../../types/lead';
import { useFormState } from '../../hooks/useFormState';
import {
  KONSULTASI_OPTIONS,
  KONDISI_ANAK_OPTIONS,
  STATUS_ANAK_OPTIONS,
  TOTAL_QUESTION_STEPS,
} from '../../lib/formConfig';
import { submitLead } from '../../lib/submitLead';
import { redirectToWhatsApp, getWhatsAppRedirectUrl } from '../../lib/whatsapp';
import { Logo } from '../layout/Logo';
import { ChoiceCard } from './ChoiceCard';
import { ProgressBar } from './ProgressBar';
import { ReviewSummary } from './ReviewSummary';

interface TypeformLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  tracking: TrackingData;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function TypeformLeadForm({ isOpen, onClose, tracking }: TypeformLeadFormProps) {
  const {
    currentStep,
    formData,
    error,
    honeypot,
    progressPercent,
    updateField,
    setHoneypot,
    goNext,
    goBack,
    skipKekhawatiran,
    reset,
    setError,
  } = useFormState();

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      reset();
      setSubmitStatus('idle');
      setSubmitMessage('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, reset]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    if (honeypot) return;

    setSubmitStatus('loading');
    setSubmitMessage('Mengirim pendaftaran…');
    setError(null);

    const result = await submitLead(formData, tracking, honeypot);

    if (result.success) {
      setSubmitStatus('success');
      setSubmitMessage('Pendaftaran berhasil. Mengarahkan ke WhatsApp…');
      setTimeout(() => {
        redirectToWhatsApp();
      }, 1500);
    } else {
      setSubmitStatus('error');
      setSubmitMessage(
        result.message || 'Maaf, pendaftaran belum berhasil terkirim. Silakan coba lagi.'
      );
      setError(result.message || 'Maaf, pendaftaran belum berhasil terkirim. Silakan coba lagi.');
    }
  }, [formData, tracking, honeypot, setError]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        goNext();
      }
    },
    [goNext]
  );

  if (!isOpen) return null;

  const showBack =
    currentStep !== 'welcome' && submitStatus !== 'loading' && submitStatus !== 'success';

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="form-step">
            <h2 className="form-step__title">Siap membantu anak lebih punya arah?</h2>
            <p className="form-step__helper">
              Jawab beberapa pertanyaan singkat agar tim TEKAD dapat mengirimkan informasi webinar
              yang sesuai dengan kondisi anak Bapak/Ibu.
            </p>
          </div>
        );

      case 'nama_orang_tua':
        return (
          <div className="form-step">
            <p className="form-step__counter">Pertanyaan 1 dari {TOTAL_QUESTION_STEPS}</p>
            <h2 className="form-step__title">Nama Bapak/Ibu siapa?</h2>
            <p className="form-step__helper">
              Kami akan menggunakan nama ini saat menghubungi Bapak/Ibu melalui WhatsApp.
            </p>
            <input
              type="text"
              className={`form-input${error ? ' form-input--error' : ''}`}
              placeholder="Contoh: Ibu Siti / Bapak Ahmad"
              value={formData.nama_orang_tua}
              onChange={(e) => updateField('nama_orang_tua', e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        );

      case 'whatsapp':
        return (
          <div className="form-step">
            <p className="form-step__counter">Pertanyaan 2 dari {TOTAL_QUESTION_STEPS}</p>
            <h2 className="form-step__title">Nomor WhatsApp aktif Bapak/Ibu?</h2>
            <p className="form-step__helper">
              Link webinar dan informasi lanjutan akan dikirim melalui WhatsApp.
            </p>
            <input
              type="tel"
              className={`form-input${error ? ' form-input--error' : ''}`}
              placeholder="08xxxxxxxxxx"
              value={formData.whatsapp}
              onChange={(e) => updateField('whatsapp', e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        );

      case 'status_anak':
        return (
          <div className="form-step">
            <p className="form-step__counter">Pertanyaan 3 dari {TOTAL_QUESTION_STEPS}</p>
            <h2 className="form-step__title">Saat ini anak Bapak/Ibu berada di tahap apa?</h2>
            <p className="form-step__helper">Pilih yang paling sesuai.</p>
            <div className="choice-list">
              {STATUS_ANAK_OPTIONS.map((opt) => (
                <ChoiceCard
                  key={opt}
                  label={opt}
                  selected={formData.status_anak === opt}
                  onSelect={() => updateField('status_anak', opt)}
                />
              ))}
            </div>
          </div>
        );

      case 'kondisi_anak':
        return (
          <div className="form-step">
            <p className="form-step__counter">Pertanyaan 4 dari {TOTAL_QUESTION_STEPS}</p>
            <h2 className="form-step__title">
              Kondisi mana yang paling menggambarkan anak Bapak/Ibu saat ini?
            </h2>
            <p className="form-step__helper">
              Jawaban ini membantu kami memahami kebutuhan anak Bapak/Ibu.
            </p>
            <div className="choice-list">
              {KONDISI_ANAK_OPTIONS.map((opt) => (
                <ChoiceCard
                  key={opt}
                  label={opt}
                  selected={formData.kondisi_anak === opt}
                  onSelect={() => updateField('kondisi_anak', opt)}
                />
              ))}
            </div>
          </div>
        );

      case 'kekhawatiran_utama':
        return (
          <div className="form-step">
            <p className="form-step__counter">Pertanyaan 5 dari {TOTAL_QUESTION_STEPS}</p>
            <h2 className="form-step__title">
              Apa kekhawatiran terbesar Bapak/Ibu tentang masa depan anak?
            </h2>
            <p className="form-step__helper">
              Boleh ditulis singkat. Contoh: belum percaya diri, belum punya skill, terlalu sering
              main HP, belum tahu mau kerja apa.
            </p>
            <textarea
              className="form-input form-textarea"
              placeholder="Tulis kekhawatiran Bapak/Ibu di sini…"
              value={formData.kekhawatiran_utama}
              onChange={(e) => updateField('kekhawatiran_utama', e.target.value)}
            />
          </div>
        );

      case 'kota':
        return (
          <div className="form-step">
            <p className="form-step__counter">Pertanyaan 6 dari {TOTAL_QUESTION_STEPS}</p>
            <h2 className="form-step__title">Bapak/Ibu berdomisili di kota/kecamatan mana?</h2>
            <p className="form-step__helper">
              Ini membantu kami menyesuaikan informasi kegiatan dan konsultasi.
            </p>
            <input
              type="text"
              className={`form-input${error ? ' form-input--error' : ''}`}
              placeholder="Contoh: Cirebon / Indramayu / Kuningan"
              value={formData.kota}
              onChange={(e) => updateField('kota', e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        );

      case 'bersedia_konsultasi':
        return (
          <div className="form-step">
            <p className="form-step__counter">Pertanyaan 7 dari {TOTAL_QUESTION_STEPS}</p>
            <h2 className="form-step__title">
              Apakah Bapak/Ibu bersedia dihubungi untuk konsultasi gratis setelah webinar?
            </h2>
            <p className="form-step__helper">
              Konsultasi ini bertujuan membantu memetakan kondisi anak. Tidak wajib langsung
              mendaftar program.
            </p>
            <div className="choice-list">
              {KONSULTASI_OPTIONS.map((opt) => (
                <ChoiceCard
                  key={opt}
                  label={opt}
                  selected={formData.bersedia_konsultasi === opt}
                  onSelect={() => updateField('bersedia_konsultasi', opt)}
                />
              ))}
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="form-step">
            <h2 className="form-step__title">Terima kasih, data hampir selesai.</h2>
            <p className="form-step__helper">
              Klik tombol di bawah ini untuk mengirim pendaftaran. Setelah berhasil, Bapak/Ibu
              akan diarahkan ke WhatsApp TEKAD.
            </p>
            <ReviewSummary data={formData} />
            <p className="form-consent">
              Dengan mengisi form ini, Bapak/Ibu bersedia dihubungi oleh tim TEKAD melalui WhatsApp
              untuk informasi webinar dan konsultasi terkait program.
            </p>
            {submitStatus === 'success' && (
              <div className="form-success" role="status">
                {submitMessage}
                {getWhatsAppRedirectUrl() !== '#' && (
                  <>
                    {' '}
                    <a href={getWhatsAppRedirectUrl()}>Klik di sini</a> jika belum diarahkan
                    otomatis.
                  </>
                )}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="form-error" role="alert">
                {submitMessage}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => {
    if (submitStatus === 'success') return null;

    if (currentStep === 'welcome') {
      return (
        <div className="form-overlay__footer">
          <button type="button" className="btn btn--primary" onClick={goNext}>
            Mulai Daftar
          </button>
        </div>
      );
    }

    if (currentStep === 'kekhawatiran_utama') {
      return (
        <div className="form-overlay__footer">
          {showBack && (
            <button type="button" className="btn btn--secondary-text" onClick={goBack}>
              Kembali
            </button>
          )}
          <button type="button" className="btn btn--secondary-text" onClick={skipKekhawatiran}>
            Lewati
          </button>
          <button type="button" className="btn btn--primary" onClick={goNext}>
            Lanjut
          </button>
        </div>
      );
    }

    if (currentStep === 'review') {
      return (
        <div className="form-overlay__footer">
          {showBack && (
            <button type="button" className="btn btn--secondary-text" onClick={goBack}>
              Kembali
            </button>
          )}
          <button
            type="button"
            className={`btn btn--primary${submitStatus === 'loading' ? ' btn--loading' : ''}`}
            onClick={handleSubmit}
            disabled={submitStatus === 'loading'}
          >
            {submitStatus === 'loading' ? (
              <>
                <span className="btn__spinner" />
                Mengirim…
              </>
            ) : (
              'Kirim Pendaftaran'
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="form-overlay__footer">
        {showBack && (
          <button type="button" className="btn btn--secondary-text" onClick={goBack}>
            Kembali
          </button>
        )}
        <button type="button" className="btn btn--primary" onClick={goNext}>
          Lanjut
        </button>
      </div>
    );
  };

  return (
    <div className="form-overlay" role="dialog" aria-modal="true" aria-label="Form pendaftaran webinar">
      <div className="form-overlay__header">
        <div className="form-overlay__logo">
          <Logo className="logo--form" />
          <span className="form-overlay__logo-text">Pendaftaran Webinar</span>
        </div>
        <button
          type="button"
          className="form-overlay__close"
          onClick={handleClose}
          aria-label="Tutup form"
          disabled={submitStatus === 'loading'}
        >
          <X size={22} />
        </button>
      </div>

      <ProgressBar percent={progressPercent} />

      <div className="form-overlay__body">
        {renderStepContent()}
        {error && currentStep !== 'review' && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        <input
          type="text"
          name="website"
          className="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          aria-hidden="true"
        />
      </div>

      {renderFooter()}
    </div>
  );
}