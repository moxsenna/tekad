import { useCallback, useState } from 'react';
import type { FormStepId, LeadFormData } from '../types/lead';
import { validateRequired, validateWhatsApp } from '../lib/validation';

const STEP_ORDER: FormStepId[] = [
  'identitas',
  'kondisi',
  'domisili',
];

const INITIAL_DATA: LeadFormData = {
  nama_orang_tua: '',
  whatsapp: '',
  whatsapp_normalized: '',
  status_anak: '',
  kondisi_anak: '',
  kekhawatiran_utama: '',
  kota: '',
  bersedia_konsultasi: 'Belum Ditanyakan',
};

export function useFormState() {
  const [currentStep, setCurrentStep] = useState<FormStepId>('identitas');
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
      case 'identitas': {
        const errName = validateRequired(formData.nama_orang_tua, 'Nama');
        if (errName) {
          setError(errName);
          return false;
        }
        const errWa = validateWhatsApp(formData.whatsapp);
        if (errWa) {
          setError(errWa);
          return false;
        }
        return true;
      }
      case 'kondisi': {
        const errStatus = validateRequired(formData.status_anak, 'Status anak');
        if (errStatus) {
          setError(errStatus);
          return false;
        }
        const errKondisi = validateRequired(formData.kondisi_anak, 'Kondisi anak');
        if (errKondisi) {
          setError(errKondisi);
          return false;
        }
        return true;
      }
      case 'domisili': {
        const errKota = validateRequired(formData.kota, 'Kota/domisili');
        setError(errKota);
        return !errKota;
      }
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

  const reset = useCallback(() => {
    setCurrentStep('identitas');
    setFormData(INITIAL_DATA);
    setError(null);
    setHoneypot('');
  }, []);

  const progressPercent = Math.round(((stepIndex + 1) / STEP_ORDER.length) * 100);

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
    reset,
    validateCurrentStep,
    setError,
  };
}