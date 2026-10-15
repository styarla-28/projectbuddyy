import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export type Surface = "pebble" | "moss" | "bubble" | "sand";
export const BUBBLE_REGROW_MS = 3000;

type Point = { x: number; y: number; t: number };
type Stroke = { id: number; points: Point[]; surface: Surface };

const FADE_MS = 1800;

function tone(name: string, alpha: number) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "gray";
  return `color-mix(in oklab, ${v} ${Math.round(alpha * 100)}%, transparent)`;
}

export function useSoftFeedback(sound: boolean, haptics: boolean, quiet: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  return useCallback((kind: "pop" | "touch") => {
    if (haptics && typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(kind === "pop" ? 18 : 10);
    if (!sound || quiet || typeof window === "undefined" || !window.AudioContext) return;
    ctx.current ??= new AudioContext();
    const ac = ctx.current;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(kind === "pop" ? 520 : 330, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(kind === "pop" ? 260 : 220, ac.currentTime + 0.25);
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.04, ac.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.3);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.32);
  }, [sound, haptics, quiet]);
}

export function TraceCanvas({ surface, quiet, onTouch, clearKey }: { surface: Exclude<Surface, "bubble">; quiet: boolean; onTouch: () => void; clearKey: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const active = useRef(new Map<number, Stroke>());
  const last = useRef(new Map<number, number>());

  useEffect(() => { strokes.current = []; active.current.clear(); }, [surface, clearKey]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let frame = 0;
    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = el.getBoundingClientRect();
      if (el.width !== Math.round(width * dpr)) { el.width = Math.round(width * dpr); el.height = Math.round(height * dpr); }
      const g = el.getContext("2d");
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, width, height);
      const now = performance.now();
      const fades = surface !== "sand" && !quiet;
      if (fades) strokes.current = strokes.current.filter((s) => active.current.has(s.id) || now - s.points[s.points.length - 1].t < FADE_MS);
      g.lineCap = "round"; g.lineJoin = "round";
      for (const s of strokes.current) {
        for (let i = 1; i < s.points.length; i++) {
          const a = s.points[i - 1], b = s.points[i];
          const life = fades ? Math.max(0, 1 - (now - b.t) / FADE_MS) : 1;
          if (life <= 0) continue;
          if (surface === "sand") {
            g.strokeStyle = tone("--honey", 0.45); g.lineWidth = 22; drawSeg(g, a, b);
            for (const off of [-7, 0, 7]) { g.strokeStyle = tone("--wood", 0.75); g.lineWidth = 2; drawSeg(g, a, b, off); }
          } else if (surface === "moss") {
            g.strokeStyle = tone("--primary", 0.35 * life); g.lineWidth = 26; drawSeg(g, a, b);
            g.strokeStyle = tone("--primary-strong", 0.25 * life); g.lineWidth = 8; drawSeg(g, a, b);
          } else {
            g.strokeStyle = tone("--stream", 0.3 * life); g.lineWidth = 18; drawSeg(g, a, b);
          }
        }
        if (surface === "pebble" && fades) {
          for (let i = 0; i < s.points.length; i += 6) {
            const p = s.points[i]; const age = (now - p.t) / FADE_MS;
            if (age >= 1) continue;
            const ease = 1 - Math.pow(1 - age, 3);
            g.strokeStyle = tone("--stream", 0.35 * (1 - age)); g.lineWidth = 1.5;
            g.beginPath(); g.arc(p.x, p.y, 8 + ease * 34, 0, Math.PI * 2); g.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [surface, quiet]);

  const pos = (e: React.PointerEvent) => { const r = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }; };
  return <canvas ref={canvas} aria-label={`${surface} tracing surface`} role="img" data-testid="trace-canvas" className="absolute inset-0 h-full w-full touch-none"
    onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); const s = { id: Math.random(), points: [pos(e)], surface }; active.current.set(e.pointerId, s); strokes.current.push(s); onTouch(); }}
    onPointerMove={(e) => {
      const s = active.current.get(e.pointerId); if (!s) return;
      const p = pos(e); const prev = s.points[s.points.length - 1] ?? p;
      // Moss has a velvet resistance: the trail eases toward the finger.
      const k = surface === "moss" ? 0.35 : 1;
      s.points.push({ x: prev.x + (p.x - prev.x) * k, y: prev.y + (p.y - prev.y) * k, t: p.t });
      const lt = last.current.get(e.pointerId) ?? 0;
      if (p.t - lt > 450) { last.current.set(e.pointerId, p.t); onTouch(); }
    }}
    onPointerUp={(e) => active.current.delete(e.pointerId)} onPointerCancel={(e) => active.current.delete(e.pointerId)} />;
}

function drawSeg(g: CanvasRenderingContext2D, a: Point, b: Point, off = 0) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
  const ox = (-dy / len) * off, oy = (dx / len) * off;
  g.beginPath(); g.moveTo(a.x + ox, a.y + oy); g.lineTo(b.x + ox, b.y + oy); g.stroke();
}

export function BubbleWrap({ onPop }: { onPop: () => void }) {
  const [popped, setPopped] = useState<Set<number>>(new Set());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2 p-4 sm:gap-3" aria-label="Bubble seed wrap">
    {Array.from({ length: 16 }, (_, i) => {
      const isPopped = popped.has(i);
      return <Button key={i} variant="ghost" aria-label={`Seed bubble ${i + 1}`} aria-pressed={isPopped} disabled={isPopped}
        onClick={() => {
          setPopped((p) => new Set(p).add(i)); onPop();
          timers.current.push(setTimeout(() => setPopped((p) => { const n = new Set(p); n.delete(i); return n; }), BUBBLE_REGROW_MS));
        }}
        className={`seed-bubble h-full min-h-12 w-full rounded-[48%_52%_46%_54%] border p-0 hover:bg-honey-soft disabled:opacity-100 ${isPopped ? "seed-bloom border-primary/30 bg-primary-soft" : "border-honey/40 bg-honey-soft shadow-soft"}`}>
        {isPopped ? <span className="block h-3 w-3 rounded-full bg-primary/60" /> : <span className="block h-4 w-3 rounded-full bg-card/80" />}
      </Button>;
    })}
  </div>;
}
