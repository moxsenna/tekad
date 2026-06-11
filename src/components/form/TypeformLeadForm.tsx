import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { TrackingData } from '../../types/lead';
import { useFormState } from '../../hooks/useFormState';
import {
  trackAddPaymentInfo,
  trackWebinarFormStart,
  trackWebinarFormStep,
  trackWebinarRegistrationSuccess,
  trackWebinarWhatsAppRedirect,
} from '../../lib/metaPixel';
import type { LpVariant } from '../../lib/routing';
import {
  KONDISI_ANAK_OPTIONS,
  STATUS_ANAK_OPTIONS,
} from '../../lib/formConfig';
import { submitLead } from '../../lib/submitLead';
import { buildWhatsAppRedirectUrl, redirectToWhatsApp } from '../../lib/whatsapp';
import { Logo } from '../layout/Logo';
import { ChoiceCard } from './ChoiceCard';
import { ProgressBar } from './ProgressBar';

interface TypeformLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  tracking: TrackingData;
  refCode: string;
  lpVariant: LpVariant;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const TRACKED_FORM_STEPS = new Set(['identitas', 'kondisi', 'domisili']);

export function TypeformLeadForm({
  isOpen,
  onClose,
  tracking,
  refCode,
  lpVariant,
}: TypeformLeadFormProps) {
  const {
    currentStep,
    formData,
    error,
    honeypot,
    progressPercent,
    stepIndex,
    updateField,
    setHoneypot,
    goNext,
    goBack,
    reset,
    setError,
  } = useFormState();

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const trackedStepsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      reset();
      setSubmitStatus('idle');
      setSubmitMessage('');
      trackedStepsRef.current.clear();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen || !TRACKED_FORM_STEPS.has(currentStep)) return;

    if (trackedStepsRef.current.size === 0) {
      trackWebinarFormStart(lpVariant);
    }

    if (trackedStepsRef.current.has(currentStep)) return;
    trackedStepsRef.current.add(currentStep);

    trackWebinarFormStep(lpVariant, stepIndex, currentStep);

    if (currentStep === 'domisili') {
      trackAddPaymentInfo({ lp_variant: lpVariant });
    }
  }, [currentStep, isOpen, lpVariant, stepIndex]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    if (honeypot) return;

    setSubmitStatus('loading');
    setSubmitMessage('Mengirim pendaftaran…');
    setError(null);

    const result = await submitLead(
      formData,
      { ...tracking, ref_code: refCode },
      honeypot
    );

    if (result.success) {
      setSubmitStatus('success');
      setSubmitMessage('Pendaftaran berhasil. Mengarahkan ke WhatsApp…');
      trackWebinarRegistrationSuccess(lpVariant, tracking);
      setTimeout(() => {
        trackWebinarWhatsAppRedirect(lpVariant);
        redirectToWhatsApp(formData);
      }, 1500);
    } else {
      setSubmitStatus('error');
      setSubmitMessage(
        result.message || 'Maaf, pendaftaran belum berhasil terkirim. Silakan coba lagi.'
      );
      setError(result.message || 'Maaf, pendaftaran belum berhasil terkirim. Silakan coba lagi.');
    }
  }, [formData, tracking, refCode, honeypot, setError, lpVariant]);

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
    currentStep !== 'identitas' && submitStatus !== 'loading' && submitStatus !== 'success';

  const renderStepContent = () => {
    switch (currentStep) {
      case 'identitas':
        return (
          <div className="form-step">
            <h2 className="form-step__title">Siap membantu anak lebih punya arah?</h2>
            <p className="form-step__helper">
              Isi nama dan nomor WhatsApp Bapak/Ibu di bawah ini untuk memulai pendaftaran webinar gratis.
            </p>
            <div className="form-step__assurance">
              ⚡ Hanya 3 langkah, kurang dari 2 menit.
            </div>
            <div className="form-group-stacked">
              <div className="form-field-wrapper">
                <label className="form-field-label">Nama Lengkap Anda</label>
                <input
                  type="text"
                  className={`form-input${error && !formData.nama_orang_tua ? ' form-input--error' : ''}`}
                  placeholder="Contoh: Ibu Siti / Bapak Ahmad"
                  value={formData.nama_orang_tua}
                  onChange={(e) => updateField('nama_orang_tua', e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-field-wrapper" style={{ marginTop: '1.25rem' }}>
                <label className="form-field-label">Nomor WhatsApp Aktif</label>
                <p className="form-step__helper-tiny">Jadwal dan link webinar akan dikirim ke nomor ini.</p>
                <input
                  type="tel"
                  className={`form-input${error && !formData.whatsapp ? ' form-input--error' : ''}`}
                  placeholder="Contoh: 08123456789"
                  value={formData.whatsapp}
                  onChange={(e) => updateField('whatsapp', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 'kondisi':
        return (
          <div className="form-step">
            <h2 className="form-step__title">Kondisi Anak Saat Ini</h2>
            
            <div className="form-field-wrapper">
              <label className="form-field-label">1. Tahap Pendidikan/Karir Anak</label>
              <div className="choice-list choice-list--grid">
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

            <div className="form-field-wrapper" style={{ marginTop: '1.25rem' }}>
              <label className="form-field-label">2. Deskripsi Masalah Utama</label>
              <div className="choice-list choice-list--grid">
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

            <div className="form-field-wrapper" style={{ marginTop: '1.25rem' }}>
              <label className="form-field-label">3. Apa kekhawatiran terbesar Bapak/Ibu? (Opsional)</label>
              <textarea
                className="form-input form-textarea form-textarea--small"
                placeholder="Boleh ditulis singkat. Contoh: belum percaya diri, kecanduan game, dll."
                value={formData.kekhawatiran_utama}
                onChange={(e) => updateField('kekhawatiran_utama', e.target.value)}
              />
            </div>
          </div>
        );

      case 'domisili':
        return (
          <div className="form-step">
            <h2 className="form-step__title">Satu Langkah Terakhir</h2>
            <p className="form-step__helper">
              Kota atau domisili Bapak/Ibu saat ini? (Membantu kami menyesuaikan info jadwal kegiatan).
            </p>
            <div className="form-field-wrapper">
              <input
                type="text"
                className={`form-input${error && !formData.kota ? ' form-input--error' : ''}`}
                placeholder="Contoh: Cirebon / Indramayu / Kuningan"
                value={formData.kota}
                onChange={(e) => updateField('kota', e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            
            <p className="form-consent" style={{ marginTop: '1.5rem' }}>
              Dengan mendaftar, Bapak/Ibu bersedia dihubungi oleh tim TEKAD melalui WhatsApp untuk info link masuk webinar dan panduan kesiapan kerja anak.
            </p>

            {submitStatus === 'success' && (
              <div className="form-success" role="status" style={{ marginTop: '1rem' }}>
                {submitMessage}
                {buildWhatsAppRedirectUrl(formData) !== '#' && (
                  <>
                    {' '}
                    <a href={buildWhatsAppRedirectUrl(formData)}>Klik di sini</a> jika belum diarahkan otomatis.
                  </>
                )}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="form-error" role="alert" style={{ marginTop: '1rem' }}>
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

    if (currentStep === 'domisili') {
      return (
        <div className="form-overlay__footer form-overlay__footer--double">
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
      <div
        className={`form-overlay__footer form-overlay__footer--double${showBack ? '' : ' form-overlay__footer--single'}`}
      >
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
        {error && (
          <div className="form-error" role="alert" style={{ marginTop: '0.75rem' }}>
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