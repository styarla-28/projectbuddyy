import { describe, expect, it } from "vitest";
import { washLife, pigmentAt } from "@/lib/wash";

describe("watercolor wash absorption", () => {
  it("keeps strokes fully visible for 6 seconds", () => expect(washLife(5999, false)).toBe(1));
  it("dissolves over 4 seconds after that", () => {
    expect(washLife(8000, false)).toBeCloseTo(0.5);
    expect(washLife(10000, false)).toBe(0);
  });
  it("uses a 200ms dissolve with reduced motion", () => {
    expect(washLife(6100, true)).toBeCloseTo(0.5);
    expect(washLife(6200, true)).toBe(0);
  });
  it("starts the palette on moss", () => expect(pigmentAt(0)).toBe("#5e7a5a"));
});
