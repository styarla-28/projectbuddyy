import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { BubbleWrap } from "@/components/buddy/TexturePad";

afterEach(() => { cleanup(); vi.useRealTimers(); });

it("popped seed bubbles regrow after 3 seconds", () => {
  vi.useFakeTimers();
  render(<BubbleWrap onPop={vi.fn()} />);
  const b = screen.getByRole("button", { name: "Seed bubble 1" });
  fireEvent.click(b);
  expect(b).toHaveAttribute("aria-pressed", "true");
  act(() => { vi.advanceTimersByTime(2900); });
  expect(b).toHaveAttribute("aria-pressed", "true");
  act(() => { vi.advanceTimersByTime(200); });
  expect(b).toHaveAttribute("aria-pressed", "false");
});
