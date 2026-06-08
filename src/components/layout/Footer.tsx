function formatWhatsAppDisplay(url: string): string {
  const match = url.match(/wa\.me\/(\d+)/);
  if (!match) return 'WhatsApp TEKAD';

  let digits = match[1];
  if (digits.startsWith('62')) {
    digits = `0${digits.slice(2)}`;
  }

  if (digits.length >= 11) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
  }

  return digits;
}

export function Footer() {
  const waUrl = import.meta.env.VITE_WHATSAPP_REDIRECT_URL || '';
  const waDisplay = waUrl ? formatWhatsAppDisplay(waUrl) : '';

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">LPK TEKAD</p>
        <p className="footer__tagline">Webinar Gratis untuk Orang Tua</p>
        {waDisplay && (
          <p className="footer__whatsapp">WhatsApp: {waDisplay}</p>
        )}
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} LPK TEKAD. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}