// Pigment wash timing for the Watercolor Wash canvas (canvas needs literal colors).
export const PALETTE = ["#5E7A5A", "#5C96A6", "#D9A84E"] as const;
export const WASH_HOLD_MS = 6000;
export const WASH_FADE_MS = 4000;
export const WASH_QUIET_FADE_MS = 200;

/** Opacity multiplier (1 → 0) for a stroke of the given age. */
export function washLife(ageMs: number, quiet: boolean): number {
  if (ageMs <= WASH_HOLD_MS) return 1;
  const fade = quiet ? WASH_QUIET_FADE_MS : WASH_FADE_MS;
  return Math.max(0, 1 - (ageMs - WASH_HOLD_MS) / fade);
}

/** Smoothly cycles moss → stream → ochre as the finger travels. */
export function pigmentAt(travelledPx: number): string {
  const span = 900;
  const t = (travelledPx % (span * PALETTE.length)) / span;
  const i = Math.floor(t);
  const f = t - i;
  const a = PALETTE[i % PALETTE.length], b = PALETTE[(i + 1) % PALETTE.length];
  const mix = (k: number) => Math.round(parseInt(a.slice(1 + k, 3 + k), 16) * (1 - f) + parseInt(b.slice(1 + k, 3 + k), 16) * f).toString(16).padStart(2, "0");
  return `#${mix(0)}${mix(2)}${mix(4)}`;
}
