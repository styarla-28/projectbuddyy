import type { JournalEntry } from "./journal";

const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;

export function journalToCsv(entries: JournalEntry[]) {
  const rows = entries.map((e) => [new Date(e.createdAt).toISOString(), e.text, e.body.join("; "), e.mood.join("; "), e.outcome.join("; ")].map(cell).join(","));
  return ["date,note,body,mood,outcome", ...rows].join("\n");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export function journalToText(entries: JournalEntry[]) {
  return entries.map((e) => [new Date(e.createdAt).toLocaleString("en-US"), e.text, ...[["Body", e.body], ["Mood", e.mood], ["Outcome", e.outcome]].filter(([, v]) => (v as string[]).length).map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)].join("\n")).join("\n\n---\n\n");
}
