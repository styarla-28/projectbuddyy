import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CheckInSheet } from "@/components/buddy/CheckInSheet";

describe("Optional check-in", () => {
  it("allows all three questions to be skipped without selecting answers", () => {
    const onOpenChange = vi.fn();
    render(<CheckInSheet open onOpenChange={onOpenChange} />);
    for (let step = 0; step < 3; step++) {
      fireEvent.click(screen.getByRole("button", { name: "Skip" }));
    }
    fireEvent.click(screen.getByRole("button", { name: "Okay" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
