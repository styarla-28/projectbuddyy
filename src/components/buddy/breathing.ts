export const boxBreathing = [
  { label: "Breathe in", duration: 4 },
  { label: "Hold gently", duration: 4 },
  { label: "Breathe out", duration: 4 },
  { label: "Rest", duration: 4 },
];

export const streamBreathing = [
  { label: "Breathe in", duration: 4 },
  { label: "Hold gently", duration: 7 },
  { label: "Breathe out", duration: 8 },
];

export function breathingMoment(seconds: number, stream = false) {
  const phases = stream ? streamBreathing : boxBreathing;
  const cycle = phases.reduce((total, phase) => total + phase.duration, 0);
  let elapsed = Math.max(0, seconds) % cycle;
  for (const phase of phases) {
    if (elapsed < phase.duration) return { ...phase, remaining: phase.duration - elapsed };
    elapsed -= phase.duration;
  }
  return { label: "Breathe in", duration: 4, remaining: 4 };
}