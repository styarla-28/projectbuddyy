export type JournalEntry = { id: string; text: string; createdAt: number; body: string[]; mood: string[]; outcome: string[] };

export const JOURNAL_KEY = "pb-journal-entries";

export function loadEntries(): JournalEntry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(JOURNAL_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: JournalEntry[]) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

export function dateStamp(time: number) {
  const d = new Date(time);
  const h = d.getHours();
  const part = h < 5 ? "night" : h < 12 ? "morning" : h < 17 ? "afternoon" : h < 21 ? "evening" : "night";
  const day = d.toLocaleDateString("en-US", { weekday: "long" });
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${day} ${part} · ${date}`;
}
