function formatPhoneDisplay(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('62')) {
    digits = `0${digits.slice(2)}`;
  }

  if (digits.length >= 11) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
  }

  return digits;
}

export function Footer() {
  const adminPhone = (import.meta.env.VITE_WHATSAPP_ADMIN_PHONE || '6285117259331').replace(/\D/g, '');
  const waDisplay = formatPhoneDisplay(adminPhone);

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">LPK TEKAD</p>
        <p className="footer__tagline">Webinar Gratis untuk Orang Tua</p>
        {waDisplay && (
          <p className="footer__whatsapp">
            WhatsApp:{' '}
            <a
              href={`https://wa.me/${adminPhone}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {waDisplay}
            </a>
          </p>
        )}
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} LPK TEKAD. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}