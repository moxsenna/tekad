const EVENT_ROWS = [
  { label: 'Tema', value: 'Dari Bingung Arah Menjadi Siap Kerja' },
  { label: 'Hari', value: 'Minggu, 21 Juni 2026' },
  { label: 'Jam', value: '19:00 WIB' },
  { label: 'Tempat', value: 'Online' },
  { label: 'Bonus', value: 'Checklist Kesiapan Kerja Anak' },
] as const;

export function V2EventInfoSection() {
  return (
    <section className="v2-section" id="event">
      <div className="container">
        <div className="v2-event">
          {EVENT_ROWS.map((row) => (
            <div key={row.label} className="v2-event__row">
              <span className="v2-event__label">{row.label}:</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}