import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSensoryControls } from "@/components/buddy/SensoryProvider";
import { bloom } from "@/lib/meadow";
import { washLife, PALETTE, pigmentAt } from "@/lib/wash";

export const Route = createFileRoute("/wash")({
  head: () => ({ meta: [
    { title: "Watercolor Wash · Gliding Touches | Project Buddy" },
    { name: "description", content: "Glide your fingers through soft watercolor pigment that blooms, blends and gently absorbs back into the paper." },
    { property: "og:title", content: "Watercolor Wash · Gentle Release" },
    { property: "og:description", content: "An endless, self-clearing watercolor surface for restless hands — no scores, no timers." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: WashPage,
});

type Dab = { x: number; y: number; r: number; color: string; born: number; alpha: number };
type Touch = { x: number; y: number; t: number; dab: Dab; still: number };

function WashPage() {
  const navigate = useNavigate();
  const { sensoryQuiet } = useSensoryControls();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quietRef = useRef(sensoryQuiet);
  quietRef.current = sensoryQuiet;
  const [faded, setFaded] = useState(false);
  const fadeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dabs: Dab[] = [];
    const touches = new Map<number, Touch>();
    let travelled = 0;
    let raf = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const pos = (e: PointerEvent) => { const b = canvas.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    const add = (x: number, y: number, r: number, alpha: number) => {
      const d: Dab = { x, y, r, alpha, color: pigmentAt(travelled), born: performance.now() };
      dabs.push(d);
      if (dabs.length > 2500) dabs.splice(0, dabs.length - 2500);
      return d;
    };

    const down = (e: PointerEvent) => {
      e.preventDefault();
      canvas.setPointerCapture?.(e.pointerId);
      const p = pos(e);
      touches.set(e.pointerId, { ...p, t: performance.now(), still: performance.now(), dab: add(p.x, p.y, 18, 0.42) });
      window.clearTimeout(fadeTimer.current);
      setFaded(true);
    };
    const move = (e: PointerEvent) => {
      const t = touches.get(e.pointerId);
      if (!t) return;
      const p = pos(e); const now = performance.now();
      const dist = Math.hypot(p.x - t.x, p.y - t.y);
      if (dist < 2) return;
      const speed = dist / Math.max(1, now - t.t); // px per ms
      const quiet = quietRef.current;
      const r = quiet ? 16 : Math.max(7, 22 - speed * 6);
      const alpha = quiet ? 0.38 : Math.max(0.22, 0.45 - speed * 0.08);
      const steps = Math.ceil(dist / (r * 0.4));
      let last = t.dab;
      for (let i = 1; i <= steps; i++) { travelled += dist / steps; last = add(t.x + ((p.x - t.x) * i) / steps, t.y + ((p.y - t.y) * i) / steps, r, alpha); }
      touches.set(e.pointerId, { ...p, t: now, still: now, dab: last });
    };
    const up = (e: PointerEvent) => {
      touches.delete(e.pointerId);
      if (touches.size === 0) { window.clearTimeout(fadeTimer.current); fadeTimer.current = window.setTimeout(() => setFaded(false), 2000); }
    };

    const frame = () => {
      const now = performance.now();
      const quiet = quietRef.current;
      // Slow press: the held dab blooms outward to 60px, pulsing with an 11s breath.
      if (!quiet) for (const t of touches.values()) {
        const held = (now - t.still) / 1000;
        if (held > 0.25) {
          const breath = 0.5 - 0.5 * Math.cos((now / 11000) * Math.PI * 2);
          t.dab.r = Math.min(60, t.dab.r + 0.35) * (0.92 + 0.08 * breath);
          t.dab.born = now;
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "multiply";
      for (let i = dabs.length - 1; i >= 0; i--) {
        const d = dabs[i];
        const life = washLife(now - d.born, quiet);
        if (life <= 0) { dabs.splice(i, 1); continue; }
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
        g.addColorStop(0, d.color); g.addColorStop(0.6, d.color); g.addColorStop(1, d.color + "00");
        ctx.globalAlpha = d.alpha * life * (quiet ? 1 : 0.55);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.clearTimeout(fadeTimer.current);
      canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); };
  }, []);

  return <div className="wash-screen paper-canvas fixed inset-0 overflow-hidden bg-background text-foreground">
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" role="img" aria-label="Watercolor wash surface. Glide or hold your fingers anywhere; colors gently fade on their own." />
    <header className={`wash-chrome pointer-events-none absolute inset-x-0 top-0 flex min-h-14 items-center gap-2 px-3 pt-[env(safe-area-inset-top)] ${faded ? "opacity-15" : "opacity-100"}`}>
      <Button variant="ghost" size="icon" aria-label="Return to Tools" onClick={() => navigate({ to: "/tools" })} className="pointer-events-auto h-12 w-12 shrink-0 rounded-full border border-border bg-card/70"><ArrowLeft /></Button>
      <div className="min-w-0"><h1 className="font-display text-lg leading-tight">Watercolor Wash</h1><p className="text-xs text-graphite">Gliding touches, gentle release</p></div>
    </header>
    <span className="sr-only">{PALETTE.length} soft pigments cycle on their own.</span>
  </div>;
}
