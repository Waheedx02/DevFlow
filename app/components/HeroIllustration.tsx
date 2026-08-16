// app/components/HeroIllustration.tsx
export function HeroIllustration() {
  return (
    <div className="relative">
      <svg
        width="500"
        height="400"
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        {/* Floating cards */}
        <g>
          {/* Card 1 */}
          <rect x="50" y="60" width="180" height="120" rx="16" fill="#13151b" stroke="#1e293b" strokeWidth="2" />
          <rect x="60" y="75" width="160" height="8" rx="4" fill="#1e293b" />
          <rect x="60" y="90" width="100" height="6" rx="3" fill="#0ea5e9" opacity="0.5" />
          <rect x="60" y="103" width="140" height="6" rx="3" fill="#1e293b" />
          <rect x="60" y="116" width="80" height="6" rx="3" fill="#1e293b" />
          <circle cx="220" cy="150" r="12" fill="#0ea5e9" opacity="0.3" />

          {/* Card 2 */}
          <rect x="270" y="150" width="180" height="120" rx="16" fill="#13151b" stroke="#1e293b" strokeWidth="2" />
          <rect x="280" y="165" width="160" height="8" rx="4" fill="#1e293b" />
          <rect x="280" y="180" width="120" height="6" rx="3" fill="#0ea5e9" opacity="0.5" />
          <rect x="280" y="193" width="150" height="6" rx="3" fill="#1e293b" />
          <rect x="280" y="206" width="90" height="6" rx="3" fill="#1e293b" />

          {/* Card 3 */}
          <rect x="160" y="250" width="180" height="120" rx="16" fill="#13151b" stroke="#1e293b" strokeWidth="2" />
          <rect x="170" y="265" width="160" height="8" rx="4" fill="#1e293b" />
          <rect x="170" y="280" width="130" height="6" rx="3" fill="#0ea5e9" opacity="0.5" />
          <rect x="170" y="293" width="155" height="6" rx="3" fill="#1e293b" />
          <rect x="170" y="306" width="100" height="6" rx="3" fill="#1e293b" />
        </g>

        {/* Lock icon (security) */}
        <g transform="translate(420, 80)">
          <rect x="0" y="15" width="40" height="45" rx="4" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <path d="M 10 15 Q 10 5 20 5 Q 30 5 30 15" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <circle cx="20" cy="35" r="3" fill="#0ea5e9" />
        </g>

        {/* Search icon (fast access) */}
        <g transform="translate(50, 320)">
          <circle cx="15" cy="15" r="12" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <line x1="24" y1="24" x2="32" y2="32" stroke="#0ea5e9" strokeWidth="2" />
        </g>

        {/* Decorative elements */}
        <circle cx="400" cy="350" r="20" fill="#0ea5e9" opacity="0.1" />
        <circle cx="100" cy="380" r="15" fill="#0ea5e9" opacity="0.05" />
      </svg>
    </div>
  );
}