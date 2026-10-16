import { toast } from "sonner";

const KEY = "pb-meadow-blooms";

/** Lifetime wildflower count. Only ever grows; never decreases or resets. */
export function readBlooms(): number {
  try {
    const n = Number(localStorage.getItem(KEY));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch { return 0; }
}

export function addBloom(): number {
  const next = readBlooms() + 1;
  try { localStorage.setItem(KEY, String(next)); } catch { /* storage unavailable */ }
  return next;
}

/** Grow the meadow after a finished pause, breathing, texture or tool session. */
export function bloom(): number {
  const next = addBloom();
  toast("A wildflower bloomed in your meadow.", {
    description: "Thank you for caring for yourself in this moment.",
  });
  return next;
}

export const REFLECTIONS = [
  "There is nothing you need to fix or change right in this moment.",
  "Notice the air filling your lungs as the breeze moves through the meadow.",
  "Your hands are resting peacefully right now.",
];
export const REFLECTION_MS = 25000;

export const TIMERS = [
  { id: "3", label: "3 min", seconds: 180 },
  { id: "5", label: "5 min", seconds: 300 },
  { id: "10", label: "10 min", seconds: 600 },
  { id: "open", label: "Open-ended", seconds: null },
] as const;
