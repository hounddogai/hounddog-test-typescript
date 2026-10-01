type IconProps = { className?: string };

export function StarIcon({ filled, className = "size-5" }: IconProps & { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <polygon
        points="12,3 14.35,9.26 21.04,9.56 15.8,13.74 17.58,20.19 12,16.5 6.42,20.19 8.2,13.74 2.96,9.56 9.65,9.26"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.4 10.4 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
