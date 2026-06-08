import type { LeadFormData } from '../../types/lead';

interface ReviewSummaryProps {
  data: LeadFormData;
}

export function ReviewSummary({ data }: ReviewSummaryProps) {
  const rows = [
    { label: 'Nama', value: data.nama_orang_tua },
    { label: 'WhatsApp', value: data.whatsapp },
    { label: 'Status anak', value: data.status_anak },
    { label: 'Kondisi anak', value: data.kondisi_anak },
    { label: 'Kota', value: data.kota },
    { label: 'Konsultasi', value: data.bersedia_konsultasi },
  ];

  if (data.kekhawatiran_utama) {
    rows.splice(4, 0, { label: 'Kekhawatiran', value: data.kekhawatiran_utama });
  }

  return (
    <div className="review-summary">
      {rows.map(({ label, value }) => (
        <div key={label} className="review-summary__row">
          <span className="review-summary__label">{label}</span>
          <span className="review-summary__value">{value}</span>
        </div>
      ))}
    </div>
  );
}