interface HeaderProps {
  onOpenForm: () => void;
}

export function Header({ onOpenForm }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#" className="header__logo">
          LPK TEKAD
        </a>
        <nav className="header__nav" aria-label="Navigasi utama">
          <a href="#manfaat">Manfaat</a>
          <a href="#untuk-siapa">Untuk Siapa</a>
          <a href="#materi">Materi</a>
          <a href="#daftar">Daftar</a>
        </nav>
        <button type="button" className="btn btn--primary btn--sm" onClick={onOpenForm}>
          Daftar Gratis
        </button>
      </div>
    </header>
  );
}