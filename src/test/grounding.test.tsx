import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GroundingSheet } from "@/components/buddy/GroundingSheet";

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("Stream breathing activity", () => {
  it("guides the timer through 4–7–8 and pauses without losing its place", () => {
    vi.useFakeTimers();
    render(<GroundingSheet activity="stream" onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Begin breathing" }));
    act(() => { vi.advanceTimersByTime(4000); });
    expect(screen.getByRole("timer")).toHaveTextContent("7");
    fireEvent.click(screen.getByRole("button", { name: "Pause breathing" }));
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.getByRole("timer")).toHaveTextContent("7");
    fireEvent.click(screen.getByRole("button", { name: "Begin breathing" }));
    act(() => { vi.advanceTimersByTime(7000); });
    expect(screen.getByRole("timer")).toHaveTextContent("8");
  });
});