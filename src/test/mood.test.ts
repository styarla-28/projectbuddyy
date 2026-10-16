import { beforeEach, describe, expect, it } from "vitest";
import { MOOD_KEY, addMood, averageMood, loadMoods, moodLabel, recentMoods, saveMoods, type MoodEntry } from "@/lib/mood";

const entry = (value: number, createdAt: number, context: string | null = null): MoodEntry => ({ id: crypto.randomUUID(), value, context, createdAt });

describe("mood tracker", () => {
  beforeEach(() => localStorage.clear());

  it("saves and reloads entries", () => {
    const list = addMood([], 4, "After breathing");
    saveMoods(list);
    expect(loadMoods()).toHaveLength(1);
    expect(loadMoods()[0].value).toBe(4);
    expect(loadMoods()[0].context).toBe("After breathing");
  });

  it("drops malformed entries on load", () => {
    localStorage.setItem(MOOD_KEY, JSON.stringify([{ value: 3 }, { nope: true }, null]));
    expect(loadMoods()).toHaveLength(1);
  });

  it("keeps only the last 14 days, oldest first", () => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const list = [entry(5, now - 20 * day), entry(2, now - 2 * day), entry(4, now - 1 * day)];
    const recent = recentMoods(list, 14, now);
    expect(recent.map((e) => e.value)).toEqual([2, 4]);
  });

  it("averages moods and maps labels", () => {
    expect(averageMood([])).toBeNull();
    expect(averageMood([entry(2, 1), entry(4, 2)])).toBe(3);
    expect(moodLabel(1)).toBe("Heavy");
    expect(moodLabel(5)).toBe("Bright");
  });
});
