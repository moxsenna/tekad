import { MessageCircle } from 'lucide-react';
import { getAppRoute } from '../../lib/routing';

export function Footer() {
  let adminPhone = import.meta.env.VITE_WHATSAPP_ADMIN_PHONE || '6285117259331';
  adminPhone = adminPhone.replace(/\D/g, '');

  // Safety override: if the production environment still holds the old number, force the new one.
  if (adminPhone === '6285188438643') {
    adminPhone = '6285117259331';
  }

  const route = getAppRoute();
  const tagline = route === 'affiliate' ? 'Program Mitra Affiliate' : 'Webinar Gratis untuk Orang Tua';

  const messageText = route === 'affiliate'
    ? 'Halo Admin TEKAD, saya ingin bertanya tentang Program Mitra Affiliate.'
    : 'Halo Admin TEKAD, saya ingin bertanya tentang Webinar TEKAD.';

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${adminPhone}&text=${encodeURIComponent(messageText)}&type=phone_number&app_absent=0`;

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">LPK TEKAD</p>
        <p className="footer__tagline">{tagline}</p>
        <div className="footer__whatsapp">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--secondary btn--sm footer__wa-btn"
          >
            <MessageCircle size={16} />
            Tanya Admin
          </a>
        </div>
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} LPK TEKAD. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}