import { describe, it, expect } from "vitest";
import { journalToCsv } from "@/lib/journal-export";

describe("journal export", () => {
  it("writes a CSV row per entry with quotes escaped", () => {
    const csv = journalToCsv([{ id: "a", text: 'said "hi"', createdAt: 0, body: ["Hands"], mood: [], outcome: [] }]);
    expect(csv.split("\n")).toHaveLength(2);
    expect(csv).toContain('"said ""hi"""');
  });
});
