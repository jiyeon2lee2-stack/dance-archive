export function WireGlobe({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      fill="none"
      className={className}
      style={{ color: "var(--santorini)" }}
    >
      <g stroke="currentColor" strokeWidth="1.1" fill="none">
        <circle cx="200" cy="200" r="180" />
        {/* latitudes */}
        <ellipse cx="200" cy="200" rx="180" ry="34" />
        <ellipse cx="200" cy="200" rx="180" ry="94" />
        <ellipse cx="200" cy="200" rx="180" ry="148" />
        <path d="M20 200a180 180 0 0 1 360 0" transform="translate(0,-90)" opacity="0.7" />
        <path d="M20 200a180 180 0 0 0 360 0" transform="translate(0,90)" opacity="0.7" />
        {/* longitudes */}
        <line x1="200" y1="20" x2="200" y2="380" />
        <ellipse cx="200" cy="200" rx="60" ry="180" />
        <ellipse cx="200" cy="200" rx="120" ry="180" />
        {/* simple continent outlines */}
        <path d="M96 132c14-12 32-10 44 2 10 10 26 6 34 16 8 10-4 22-16 24-14 3-22 14-34 12-14-3-24-16-30-28-5-10-6-18 2-26Z" />
        <path d="M150 214c10-4 18 4 20 14 3 14 12 24 10 38-2 16-16 30-24 26-8-4-8-20-10-32-2-14-10-24-8-34 1-7 6-10 12-12Z" />
        <path d="M236 118c22-8 46-4 62 10 12 10 6 26-6 32-14 7-30 2-44 8-12 5-24 2-26-10-2-14 0-34 14-40Z" />
        <path d="M248 202c16-6 34 2 40 16 6 16-4 34-18 40-12 5-24-4-28-16-5-14-8-34 6-40Z" />
        <path d="M290 272c16-2 30 8 30 20 0 10-12 18-24 16-12-2-20-12-18-22 1-8 6-13 12-14Z" />
      </g>
    </svg>
  );
}
