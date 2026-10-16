import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readBlooms } from "@/lib/meadow";

const navigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => options,
  useNavigate: () => navigate,
}));

const ctx2d = {
  setTransform: () => {}, clearRect: () => {}, beginPath: () => {}, arc: () => {}, fill: () => {},
  createRadialGradient: () => ({ addColorStop: () => {} }),
} as unknown as CanvasRenderingContext2D;
beforeEach(() => {
  localStorage.clear();
  navigate.mockClear();
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", { configurable: true, value: () => ctx2d });
  globalThis.requestAnimationFrame = (() => 0) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = (() => {}) as typeof cancelAnimationFrame;
});
afterEach(cleanup);

describe("Watercolor Wash session blooms", () => {
  it("grows the meadow once when leaving after painting", async () => {
    const { WashPage } = await import("@/routes/wash");
    render(<WashPage />);
    fireEvent.pointerDown(screen.getByRole("img"));
    fireEvent.pointerUp(screen.getByRole("img"));
    fireEvent.click(screen.getByRole("button", { name: "Return to Tools" }));
    expect(navigate).toHaveBeenCalledWith({ to: "/tools" });
    expect(readBlooms()).toBe(1);
  });

  it("does not bloom when leaving without touching the canvas", async () => {
    const { WashPage } = await import("@/routes/wash");
    render(<WashPage />);
    fireEvent.click(screen.getByRole("button", { name: "Return to Tools" }));
    expect(readBlooms()).toBe(0);
  });
});
