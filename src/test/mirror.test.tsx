import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MirrorSanctuary } from "@/components/buddy/MirrorSanctuary";
import { SensoryProvider, SETTINGS_KEY } from "@/components/buddy/SensoryProvider";

describe("Mirror Sanctuary camera setting", () => {
  it("hides the entry when the camera setting is off", () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ camera: false }));
    render(<SensoryProvider><MirrorSanctuary /></SensoryProvider>);
    expect(screen.queryByRole("button", { name: /Mirror Sanctuary/ })).toBeNull();
  });

  it("shows the entry when the camera setting is on", async () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ camera: true }));
    render(<SensoryProvider><MirrorSanctuary /></SensoryProvider>);
    expect(await screen.findByRole("button", { name: /Mirror Sanctuary/ })).toBeTruthy();
  });
});
