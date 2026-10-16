import { beforeEach, describe, expect, it } from "vitest";
import { COMPANION_KEY, loadCompanion } from "@/lib/companion";

describe("companion config", () => {
  beforeEach(() => localStorage.clear());
  it("defaults to Buddy in moss green with no accessory", () => {
    expect(loadCompanion()).toEqual({ name: "Buddy", color: "#5E7A5A", accessory: "None (Natural)" });
  });
  it("restores saved choices and rejects unknown accessories", () => {
    localStorage.setItem(COMPANION_KEY, JSON.stringify({ name: "Fern", color: "#C67D78", accessory: "Crown" }));
    expect(loadCompanion()).toEqual({ name: "Fern", color: "#C67D78", accessory: "None (Natural)" });
  });
});
