/**
 * LogoMark — simbolo del brand costruito interamente in SVG.
 * Concept: nodo centrale con linee di connessione (rif. Fase 03/06-B — Hero Scene).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="16" cy="16" r="15" stroke="url(#sentinel-ring)" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="4.5" fill="url(#sentinel-core)" />
      <path
        d="M16 4.5V9M16 23V27.5M4.5 16H9M23 16H27.5"
        stroke="#3D7DFA"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <defs>
        <radialGradient id="sentinel-core" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16 16) rotate(90) scale(4.5)">
          <stop stopColor="#7FA8FF" />
          <stop offset="1" stopColor="#3D7DFA" />
        </radialGradient>
        <linearGradient id="sentinel-ring" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3D7DFA" stopOpacity="0.7" />
          <stop offset="1" stopColor="#3D7DFA" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  );
}
