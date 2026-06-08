export interface LeadFormData {
  nama_orang_tua: string;
  whatsapp: string;
  whatsapp_normalized: string;
  status_anak: string;
  kondisi_anak: string;
  kekhawatiran_utama: string;
  kota: string;
  bersedia_konsultasi: string;
}

export interface TrackingData {
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  page_url: string;
  user_agent: string;
  ref_code?: string;
}

export interface LeadPayload extends LeadFormData {
  token: string;
  submitted_at: string;
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  page_url: string;
  user_agent: string;
  honeypot?: string;
  ref_code?: string;
}

export interface SubmitResponse {
  success: boolean;
  message: string;
}

export type FormStepId =
  | 'welcome'
  | 'nama_orang_tua'
  | 'whatsapp'
  | 'status_anak'
  | 'kondisi_anak'
  | 'kekhawatiran_utama'
  | 'kota'
  | 'bersedia_konsultasi'
  | 'review';