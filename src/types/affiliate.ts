export interface AffiliateFormData {
  nama: string;
  whatsapp: string;
  kota: string;
  email: string;
  profesi: string;
  media_sosial: string;
  rekening: string;
  nama_rekening: string;
  agree_terms: boolean;
}

export interface AffiliateSubmitPayload {
  action: 'registerAffiliate';
  token: string;
  nama: string;
  whatsapp: string;
  kota: string;
  email: string;
  profesi: string;
  media_sosial: string;
  rekening: string;
  nama_rekening: string;
  agree_terms: boolean;
}

export interface AffiliateSuccessResponse {
  ok: true;
  affiliate_id: string;
  kode_ref: string;
  link_ref: string;
  caption: string;
}

export interface AffiliateErrorResponse {
  ok: false;
  error: string;
  message: string;
}

export type AffiliateSubmitResponse = AffiliateSuccessResponse | AffiliateErrorResponse;