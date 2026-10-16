import { describe, it, expect, beforeEach } from "vitest";
import { loadEntries, saveEntries, JOURNAL_KEY } from "@/lib/journal";

describe("journal storage", () => {
  beforeEach(() => localStorage.clear());
  it("keeps notes on this device only via localStorage", () => {
    saveEntries([{ id: "a", text: "hi", createdAt: 1, body: [], mood: ["Tired"], outcome: [] }]);
    expect(JSON.parse(localStorage.getItem(JOURNAL_KEY)!)[0].mood).toEqual(["Tired"]);
    expect(loadEntries()).toHaveLength(1);
  });
  it("recovers from corrupt data", () => {
    localStorage.setItem(JOURNAL_KEY, "{bad");
    expect(loadEntries()).toEqual([]);
  });
});
