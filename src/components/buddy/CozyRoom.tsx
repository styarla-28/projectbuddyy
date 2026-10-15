import { useState } from "react";

/** 2D cozy sanctuary with a peaceful buddy. Tap the buddy for a blink + soft wave. */
export function CozyRoom() {
  const [react, setReact] = useState(false);

  const onTap = () => {
    if (react) return;
    setReact(true);
    setTimeout(() => setReact(false), 1200);
  };

  return (
    <svg viewBox="0 0 360 260" className="h-full w-full" role="img" aria-label="A cozy room with your buddy">
      {/* wall + floor */}
      <rect width="360" height="260" fill="var(--secondary)" />
      <rect y="190" width="360" height="70" fill="var(--wood)" opacity="0.45" />
      {/* window */}
      <rect x="230" y="34" width="96" height="84" rx="12" fill="var(--sky)" stroke="var(--card)" strokeWidth="6" />
      <line x1="278" y1="34" x2="278" y2="118" stroke="var(--card)" strokeWidth="4" />
      <circle cx="304" cy="58" r="10" fill="var(--honey)" />
      {/* shelf + plant */}
      <rect x="34" y="70" width="90" height="6" rx="3" fill="var(--wood)" />
      <rect x="48" y="52" width="20" height="18" rx="4" fill="var(--accent-soft)" />
      <path d="M58 52 q-10 -16 0 -24 q10 8 0 24" fill="var(--primary)" opacity="0.8" />
      <rect x="82" y="56" width="10" height="14" rx="2" fill="var(--accent)" opacity="0.6" />
      <rect x="95" y="50" width="10" height="20" rx="2" fill="var(--honey)" />
      {/* rug */}
      <ellipse cx="180" cy="222" rx="120" ry="18" fill="var(--accent-soft)" />
      {/* lamp glow */}
      <circle cx="60" cy="170" r="40" fill="var(--honey)" opacity="0.18" />
      <rect x="57" y="150" width="6" height="45" fill="var(--wood)" />
      <path d="M44 150 h32 l-6 -20 h-20 z" fill="var(--honey)" />

      {/* buddy */}
      <g
        onClick={onTap}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onTap()}
        tabIndex={0}
        role="button"
        aria-label="Say hi to your buddy"
        className="cursor-pointer outline-none"
      >
        <g className="animate-bob" style={{ transformOrigin: "180px 200px" }}>
          <ellipse cx="180" cy="214" rx="44" ry="6" fill="var(--foreground)" opacity="0.08" />
          <path d="M136 205 q0 -80 44 -80 q44 0 44 80 z" fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="3" />
          {/* cheeks */}
          <circle cx="160" cy="172" r="6" fill="var(--honey)" opacity="0.55" />
          <circle cx="200" cy="172" r="6" fill="var(--honey)" opacity="0.55" />
          {/* eyes: calm arcs, blink to closed lines */}
          {react ? (
            <>
              <path d="M162 160 h10" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
              <path d="M188 160 h10" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M162 162 q5 -6 10 0" stroke="var(--foreground)" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M188 162 q5 -6 10 0" stroke="var(--foreground)" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}
          <path d="M172 176 q8 7 16 0" stroke="var(--foreground)" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* waving arm */}
          <g
            style={{
              transformOrigin: "222px 180px",
              transformBox: "view-box",
              animation: react ? "wave 1.2s ease-in-out" : "none",
            }}
          >
            <ellipse cx="232" cy="168" rx="9" ry="14" fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="3" />
          </g>
          <ellipse cx="130" cy="184" rx="9" ry="13" fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="3" />
          {/* leaf sprout */}
          <path d="M180 125 q-4 -14 8 -18 q0 12 -8 18" fill="var(--primary)" />
        </g>
      </g>
    </svg>
  );
}
