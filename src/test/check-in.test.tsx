import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CheckInSheet } from "@/components/buddy/CheckInSheet";

afterEach(cleanup);

function setup() {
  const onOpenChange = vi.fn();
  const onBeginActivity = vi.fn();
  const props = { onOpenChange, onBeginActivity };
  const view = render(<CheckInSheet open {...props} />);
  return { ...view, props, onOpenChange, onBeginActivity };
}

describe("Gentle optional check-in", () => {
  it.each([0, 1, 2])("allows a direct skip to a working tool from step %s", (step) => {
    const { onBeginActivity, onOpenChange } = setup();
    for (let index = 0; index < step; index++) fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fireEvent.click(screen.getByRole("button", { name: "Skip to tools" }));
    if (step < 2) fireEvent.click(screen.getByRole("button", { name: "Begin Activity" }));
    expect(onBeginActivity).toHaveBeenCalledWith("stream");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it.each([0, 1, 2])("preserves step and choices after closing step %s", (step) => {
    const { rerender, props, onOpenChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Cuticles" }));
    for (let index = 0; index < step; index++) fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    if (step === 1) fireEvent.click(screen.getByRole("button", { name: "Restless" }));
    const previousHeading = screen.getByRole("heading").textContent;
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    rerender(<CheckInSheet open={false} {...props} />);
    rerender(<CheckInSheet open {...props} />);
    expect(screen.getByRole("heading").textContent).toBe(previousHeading);
    if (step === 1) expect(screen.getByRole("button", { name: "Restless" })).toHaveAttribute("aria-pressed", "true");
    for (let index = 0; index < step; index++) fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("button", { name: "Cuticles" })).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps the original step when closing the skipped-to tools view", () => {
    const { rerender, props } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Fingers & nails" }));
    fireEvent.click(screen.getByRole("button", { name: "Skip to tools" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    rerender(<CheckInSheet open={false} {...props} />);
    rerender(<CheckInSheet open {...props} />);
    expect(screen.getByRole("button", { name: "Fingers & nails" })).toHaveAttribute("aria-pressed", "true");
  });

  it.each([
    ["Breathe with stream", "stream"],
    ["Touch something soft / textured", "texture"],
    ["Rest in the Healing Meadow", "meadow"],
  ])("begins the selected activity: %s", (label, activity) => {
    const { onBeginActivity } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fireEvent.click(screen.getByRole("button", { name: new RegExp(label.replace("/", "\\/")) }));
    fireEvent.click(screen.getByRole("button", { name: "Begin Activity" }));
    expect(onBeginActivity).toHaveBeenCalledWith(activity);
  });

  it("can return Home without beginning an activity", () => {
    const { onBeginActivity, onOpenChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Skip to tools" }));
    fireEvent.click(screen.getByRole("button", { name: "I feel better, return to Home" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onBeginActivity).not.toHaveBeenCalled();
  });

  it("keeps every answer optional", () => {
    const onOpenChange = vi.fn();
    const onBeginActivity = vi.fn();
    render(<CheckInSheet open onOpenChange={onOpenChange} onBeginActivity={onBeginActivity} />);
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fireEvent.click(screen.getByRole("button", { name: "Begin Activity" }));
    expect(onBeginActivity).toHaveBeenCalledWith("stream");
  });
});
