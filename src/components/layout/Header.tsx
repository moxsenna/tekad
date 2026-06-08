import type { OpenFormFn } from '../../lib/metaPixel';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenForm: OpenFormFn;
  className?: string;
}

export function Header({ onOpenForm, className }: HeaderProps) {
  return (
    <header className={className ? `header ${className}` : 'header'}>
      <div className="container header__inner">
        <a href="#" className="header__logo" aria-label="TEKAD — Talent Digital Academy">
          <Logo className="logo--header" />
        </a>
        <nav className="header__nav" aria-label="Navigasi utama">
          <a href="#manfaat">Manfaat</a>
          <a href="#alur">Alur</a>
          <a href="#tentang">Tentang</a>
          <a href="#daftar">Daftar</a>
        </nav>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={() => onOpenForm('header')}
        >
          Daftar Gratis
        </button>
      </div>
    </header>
  );
}