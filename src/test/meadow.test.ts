import { beforeEach, describe, expect, it } from "vitest";
import { addBloom, bloom, readBlooms, TIMERS } from "@/lib/meadow";

beforeEach(() => localStorage.clear());

describe("Healing Meadow", () => {
  it("each completed rest permanently adds one wildflower", () => {
    expect(readBlooms()).toBe(0);
    addBloom(); addBloom();
    expect(readBlooms()).toBe(2);
  });
  it("bloom() grows the meadow for any finished self-care session", () => {
    bloom();
    expect(readBlooms()).toBe(1);
  });
  it("timers are 3, 5, 10 minutes or open-ended", () => {
    expect(TIMERS.map((t) => t.seconds)).toEqual([180, 300, 600, null]);
  });
});
