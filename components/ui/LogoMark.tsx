/**
 * Trading Sentinel mark.
 * Abstract architectural symbol: compressed planes around a central axis.
 * No circular sentinel / radial Matrix-like geometry.
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
      <path
        d="M7 8.5 16 5l9 3.5v15L16 27l-9-3.5v-15Z"
        stroke="url(#sentinel-metal)"
        strokeWidth="1.25"
        strokeLinejoin="miter"
      />
      <path
        d="M7 8.5 16 12l9-3.5M16 12v15"
        stroke="url(#sentinel-amber)"
        strokeWidth="1.1"
        strokeLinejoin="miter"
      />
      <path
        d="M10.5 11.5 16 14l5.5-2.5v8L16 22l-5.5-2.5v-8Z"
        stroke="url(#sentinel-core)"
        strokeWidth="1.05"
        strokeLinejoin="miter"
        opacity="0.92"
      />
      <path d="M16 14v8" stroke="#D8E0EA" strokeWidth="0.9" opacity="0.72" />
      <defs>
        <linearGradient id="sentinel-metal" x1="7" y1="6" x2="25" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E5EAF0" stopOpacity="0.92" />
          <stop offset="0.5" stopColor="#8E9AAA" stopOpacity="0.72" />
          <stop offset="1" stopColor="#46515E" stopOpacity="0.48" />
        </linearGradient>
        <linearGradient id="sentinel-amber" x1="8" y1="8" x2="24" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E5C477" />
          <stop offset="1" stopColor="#A66F1B" stopOpacity="0.52" />
        </linearGradient>
        <linearGradient id="sentinel-core" x1="10" y1="11" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F1D28A" />
          <stop offset="0.45" stopColor="#DAA017" />
          <stop offset="1" stopColor="#8C6825" stopOpacity="0.58" />
        </linearGradient>
      </defs>
    </svg>
  );
}
