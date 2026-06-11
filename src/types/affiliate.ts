export interface AffiliateFormData {
  nama: string;
  whatsapp: string;
  kota: string;
  email: string;
  profesi: string;
  media_sosial: string;
  bank: string;
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
  bank: string;
  rekening: string;
  nama_rekening: string;
  agree_terms: boolean;
}

export interface AffiliateDisplayData {
  kode_ref: string;
  link_ref: string;
  caption: string;
  nama?: string;
}

export interface StoredAffiliateProfile {
  kode_ref: string;
  link_ref: string;
  caption: string;
  nama: string;
  saved_at: string;
}

export interface AffiliateSuccessResponse {
  ok: true;
  affiliate_id: string;
  kode_ref: string;
  link_ref: string;
  caption: string;
}

export interface AffiliateLookupPayload {
  action: 'lookupAffiliate';
  token: string;
  whatsapp: string;
}

export interface AffiliateLookupSuccessResponse {
  ok: true;
  nama: string;
  kode_ref: string;
  link_ref: string;
  caption: string;
}

export type AffiliateLookupResponse = AffiliateLookupSuccessResponse | AffiliateErrorResponse;

export interface AffiliateErrorResponse {
  ok: false;
  error: string;
  message: string;
}

export type AffiliateSubmitResponse = AffiliateSuccessResponse | AffiliateErrorResponse;