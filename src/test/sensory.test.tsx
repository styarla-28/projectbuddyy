import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SensoryProvider, useSensoryControls } from "@/components/buddy/SensoryProvider";

function Controls() {
  const { quiet, sensoryQuiet, toggleQuiet } = useSensoryControls();
  return <><button onClick={toggleQuiet} aria-pressed={quiet}>Quiet Mode</button><output aria-label="Effective quiet">{String(sensoryQuiet)}</output><audio data-testid="sound" /></>;
}

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function systemPreference(initial: boolean) {
  let listener = () => {};
  const preference = { matches: initial, addEventListener: vi.fn((_event, callback) => { listener = callback; }), removeEventListener: vi.fn() };
  vi.spyOn(window, "matchMedia").mockReturnValue(preference as unknown as MediaQueryList);
  return (matches: boolean) => { preference.matches = matches; act(() => listener()); };
}

describe("Sanctuary sensory controls", () => {
  it("manual Quiet Mode silences media and releases quiet only when turned off", () => {
    systemPreference(false);
    render(<SensoryProvider><Controls /></SensoryProvider>);
    const audio = screen.getByTestId("sound") as HTMLAudioElement;
    fireEvent.click(screen.getByRole("button", { name: "Quiet Mode" }));
    expect(screen.getByLabelText("Effective quiet")).toHaveTextContent("true");
    expect(audio.muted).toBe(true);
    expect(document.body.classList.contains("quiet")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Quiet Mode" }));
    expect(audio.muted).toBe(false);
    expect(document.body.classList.contains("quiet")).toBe(false);
  });

  it("system reduced motion keeps the sanctuary quiet even with the manual toggle off", () => {
    const update = systemPreference(true);
    render(<SensoryProvider><Controls /></SensoryProvider>);
    const toggle = screen.getByRole("button", { name: "Quiet Mode" });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByLabelText("Effective quiet")).toHaveTextContent("true");
    expect((screen.getByTestId("sound") as HTMLAudioElement).muted).toBe(true);
    update(false);
    expect(screen.getByLabelText("Effective quiet")).toHaveTextContent("false");
  });

  it("mutes media added after Quiet Mode is enabled", async () => {
    systemPreference(false);
    render(<SensoryProvider><Controls /></SensoryProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Quiet Mode" }));
    const audio = document.createElement("audio");
    await act(async () => { document.body.append(audio); });
    expect(audio.muted).toBe(true);
    audio.remove();
  });
});