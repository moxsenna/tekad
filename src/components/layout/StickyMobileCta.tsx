import { useEffect, useState } from 'react';
import type { OpenFormFn } from '../../lib/metaPixel';

interface StickyMobileCtaProps {
  onOpenForm: OpenFormFn;
  isFormOpen: boolean;
}

export function StickyMobileCta({ onOpenForm, isFormOpen }: StickyMobileCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '0px' }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (isFormOpen || !visible) return null;

  return (
    <div className="sticky-cta" role="complementary" aria-label="Daftar webinar">
      <button
        type="button"
        className="btn btn--primary sticky-cta__btn"
        onClick={() => onOpenForm('sticky')}
      >
        Daftar via WhatsApp
      </button>
      <span className="sticky-cta__micro">Webinar gratis via WhatsApp</span>
    </div>
  );
}