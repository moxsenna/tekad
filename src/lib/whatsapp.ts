export function getWhatsAppRedirectUrl(): string {
  const url = import.meta.env.VITE_WHATSAPP_REDIRECT_URL;
  if (!url) {
    console.warn('VITE_WHATSAPP_REDIRECT_URL is not set');
  }
  return url || '#';
}

export function redirectToWhatsApp(): void {
  const url = getWhatsAppRedirectUrl();
  if (url && url !== '#') {
    window.location.href = url;
  }
}