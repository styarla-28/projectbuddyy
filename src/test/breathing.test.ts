import { describe, expect, it } from "vitest";
import { breathingMoment, streamBreathing } from "@/components/buddy/breathing";

describe("Gentle breathing timing", () => {
  it("guides a 4-second inhale, 7-second hold and 8-second exhale", () => {
    expect(streamBreathing.map((phase) => phase.duration)).toEqual([4, 7, 8]);
    expect(breathingMoment(0, true)).toEqual({ label: "Breathe in", duration: 4, remaining: 4 });
    expect(breathingMoment(3, true).remaining).toBe(1);
    expect(breathingMoment(4, true)).toEqual({ label: "Hold gently", duration: 7, remaining: 7 });
    expect(breathingMoment(10, true).remaining).toBe(1);
    expect(breathingMoment(11, true)).toEqual({ label: "Breathe out", duration: 8, remaining: 8 });
    expect(breathingMoment(18, true).remaining).toBe(1);
    expect(breathingMoment(19, true)).toEqual({ label: "Breathe in", duration: 4, remaining: 4 });
  });

  it("retains Home's distinct four-phase box breathing rhythm", () => {
    expect([0, 4, 8, 12, 16].map((seconds) => breathingMoment(seconds).label)).toEqual(["Breathe in", "Hold gently", "Breathe out", "Rest", "Breathe in"]);
  });
});