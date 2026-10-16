/**
 * Consultation chat backdrop — a calm "restaurant floor plan seen from above"
 * motif: soft blue wash, an order-grid, faint table plans and drifting glows.
 * Decorative only: never intercepts clicks, never covers the conversation.
 */
export function ChatBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* soft blue wash falling from the top */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, color-mix(in oklab, var(--primary) 12%, transparent) 0%, color-mix(in oklab, var(--primary) 4%, transparent) 26%, transparent 55%)",
        }}
      />

      {/* order grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--primary) 9%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--primary) 9%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(80% 65% at 50% 30%, #000 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(80% 65% at 50% 30%, #000 20%, transparent 78%)",
        }}
      />

      {/* table plan: round tables, square tables, chairs */}
      <svg className="absolute inset-0 h-full w-full" style={{ opacity: 0.5 }}>
        <defs>
          <pattern id="ms-floor" width="260" height="210" patternUnits="userSpaceOnUse" patternTransform="rotate(-5)">
            <g fill="none" stroke="var(--color-primary)" strokeOpacity="0.22" strokeWidth="1.4">
              <rect x="26" y="30" width="68" height="46" rx="14" />
              <circle cx="176" cy="52" r="24" />
              <rect x="40" y="132" width="42" height="42" rx="12" />
              <circle cx="196" cy="158" r="16" />
            </g>
            <g fill="var(--color-primary)" fillOpacity="0.16">
              <circle cx="60" cy="16" r="5" />
              <circle cx="60" cy="90" r="5" />
              <circle cx="176" cy="18" r="5" />
              <circle cx="176" cy="86" r="5" />
              <circle cx="140" cy="52" r="5" />
              <circle cx="212" cy="52" r="5" />
              <circle cx="24" cy="153" r="4.5" />
              <circle cx="100" cy="153" r="4.5" />
            </g>
          </pattern>
          <radialGradient id="ms-fade-grad" cx="50%" cy="38%" r="72%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </radialGradient>
          <mask id="ms-fade">
            <rect width="100%" height="100%" fill="url(#ms-fade-grad)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#ms-floor)" mask="url(#ms-fade)" />
      </svg>

      {/* drifting glows */}
      <div className="ms-glow absolute -top-28 left-[12%] h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="ms-glow ms-glow-2 absolute right-[6%] top-[38%] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="ms-glow ms-glow-3 absolute -bottom-24 left-[34%] h-72 w-[26rem] rounded-full bg-primary/10 blur-3xl" />

      {/* soft base so the composer area stays readable */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          backgroundImage:
            "linear-gradient(180deg, transparent, color-mix(in oklab, var(--background) 88%, transparent))",
        }}
      />
    </div>
  );
}
