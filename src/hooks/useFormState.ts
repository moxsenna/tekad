import { useCallback, useState } from 'react';
import type { FormStepId, LeadFormData } from '../types/lead';
import { validateRequired, validateWhatsApp } from '../lib/validation';

const STEP_ORDER: FormStepId[] = [
  'welcome',
  'nama_orang_tua',
  'whatsapp',
  'status_anak',
  'kondisi_anak',
  'kekhawatiran_utama',
  'kota',
  'bersedia_konsultasi',
  'review',
];

const INITIAL_DATA: LeadFormData = {
  nama_orang_tua: '',
  whatsapp: '',
  whatsapp_normalized: '',
  status_anak: '',
  kondisi_anak: '',
  kekhawatiran_utama: '',
  kota: '',
  bersedia_konsultasi: '',
};

export function useFormState() {
  const [currentStep, setCurrentStep] = useState<FormStepId>('welcome');
  const [formData, setFormData] = useState<LeadFormData>(INITIAL_DATA);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  const stepIndex = STEP_ORDER.indexOf(currentStep);

  const updateField = useCallback(<K extends keyof LeadFormData>(field: K, value: LeadFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const validateCurrentStep = useCallback((): boolean => {
    switch (currentStep) {
      case 'welcome':
        return true;
      case 'nama_orang_tua': {
        const err = validateRequired(formData.nama_orang_tua, 'Nama');
        setError(err);
        return !err;
      }
      case 'whatsapp': {
        const waError = validateWhatsApp(formData.whatsapp);
        setError(waError);
        return !waError;
      }
      case 'status_anak': {
        const err = validateRequired(formData.status_anak, 'Status anak');
        setError(err);
        return !err;
      }
      case 'kondisi_anak': {
        const err = validateRequired(formData.kondisi_anak, 'Kondisi anak');
        setError(err);
        return !err;
      }
      case 'kekhawatiran_utama':
        return true;
      case 'kota': {
        const err = validateRequired(formData.kota, 'Kota/domisili');
        setError(err);
        return !err;
      }
      case 'bersedia_konsultasi': {
        const err = validateRequired(formData.bersedia_konsultasi, 'Kesediaan konsultasi');
        setError(err);
        return !err;
      }
      case 'review':
        return true;
      default:
        return true;
    }
  }, [currentStep, formData]);

  const goNext = useCallback(() => {
    if (!validateCurrentStep()) return;
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex]);
      setError(null);
    }
  }, [stepIndex, validateCurrentStep]);

  const goBack = useCallback(() => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEP_ORDER[prevIndex]);
      setError(null);
    }
  }, [stepIndex]);

  const skipKekhawatiran = useCallback(() => {
    setFormData((prev) => ({ ...prev, kekhawatiran_utama: '' }));
    setError(null);
    const idx = STEP_ORDER.indexOf('kekhawatiran_utama');
    if (idx + 1 < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[idx + 1]);
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentStep('welcome');
    setFormData(INITIAL_DATA);
    setError(null);
    setHoneypot('');
  }, []);

  const progressPercent =
    currentStep === 'welcome'
      ? 0
      : currentStep === 'review'
        ? 100
        : Math.round((stepIndex / STEP_ORDER.length) * 100);

  return {
    currentStep,
    formData,
    error,
    honeypot,
    stepIndex,
    progressPercent,
    updateField,
    setHoneypot,
    goNext,
    goBack,
    skipKekhawatiran,
    reset,
    validateCurrentStep,
    setError,
  };
}