export type MoodEntry = { id: string; value: number; context: string | null; createdAt: number };

export const MOOD_KEY = "pb-mood-entries";

export const MOODS = [
  { value: 1, label: "Heavy", emoji: "🌧️" },
  { value: 2, label: "Tender", emoji: "🌫️" },
  { value: 3, label: "Okay", emoji: "🍃" },
  { value: 4, label: "Light", emoji: "🌤️" },
  { value: 5, label: "Bright", emoji: "🌼" },
] as const;

export const MOOD_CONTEXTS = ["After a pause", "After breathing", "After texture pad", "After the meadow", "Just checking in"] as const;

export function loadMoods(): MoodEntry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(MOOD_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((e) => typeof e?.value === "number") : [];
  } catch {
    return [];
  }
}

export function saveMoods(entries: MoodEntry[]) {
  localStorage.setItem(MOOD_KEY, JSON.stringify(entries));
}

export function addMood(entries: MoodEntry[], value: number, context: string | null): MoodEntry[] {
  return [{ id: crypto.randomUUID(), value, context, createdAt: Date.now() }, ...entries];
}

/** Entries from the last `days` days, oldest first, for the history view. */
export function recentMoods(entries: MoodEntry[], days = 14, now = Date.now()): MoodEntry[] {
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  return entries.filter((e) => e.createdAt >= cutoff).slice().sort((a, b) => a.createdAt - b.createdAt);
}

export function moodLabel(value: number): string {
  return MOODS.find((m) => m.value === value)?.label ?? "Okay";
}

export function moodEmoji(value: number): string {
  return MOODS.find((m) => m.value === value)?.emoji ?? "🍃";
}

/** Average mood for entries, rounded to one decimal, or null when empty. */
export function averageMood(entries: MoodEntry[]): number | null {
  if (entries.length === 0) return null;
  return Math.round((entries.reduce((sum, e) => sum + e.value, 0) / entries.length) * 10) / 10;
}
