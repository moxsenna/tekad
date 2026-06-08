interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <img
      src="/tekad-logo.png"
      alt="TEKAD — Talent Digital Academy"
      className={`logo${className ? ` ${className}` : ''}`}
    />
  );
}