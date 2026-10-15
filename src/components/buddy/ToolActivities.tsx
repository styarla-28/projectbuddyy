import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { breathingMoment } from "@/components/buddy/breathing";

export function StreamBreathing() {
  const [length, setLength] = useState(60);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => { if (seconds >= length) setRunning(false); }, [seconds, length]);
  const done = seconds >= length;
  const moment = breathingMoment(seconds, true);
  return <div className="flex flex-col items-center gap-5 py-4">
    <div className="flex gap-2" role="group" aria-label="Length">{[30, 60, 180].map((l) => <Button key={l} variant="ghost" aria-pressed={length === l} onClick={() => { setLength(l); setSeconds(0); setRunning(false); }} className={`min-h-12 rounded-full border px-4 ${length === l ? "border-stream bg-stream-soft text-foreground" : "border-border bg-card text-graphite"}`}>{l === 30 ? "30s" : `${l / 60}m`}</Button>)}</div>
    <div className="breathing-pebble grid h-40 w-40 place-items-center border-2 border-stream/40 bg-stream-soft text-center text-primary-strong">
      {done ? <p className="px-4 font-display text-lg">A lovely pause. Well done.</p> : <div><p className="font-display text-xl" aria-live="polite">{moment.label}</p><p className="mt-2 text-2xl tabular-nums">{moment.remaining}</p></div>}
    </div>
    <p className="text-xs text-muted-foreground tabular-nums">{Math.max(0, length - seconds)}s left · in 4, hold 7, out 8</p>
    <Button className="h-12 rounded-full px-6" onClick={() => { if (done) setSeconds(0); setRunning((r) => !r); }}>{running ? <Pause /> : <Play />}{running ? "Pause" : done ? "Again" : "Begin"}</Button>
  </div>;
}

function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  const [i, setI] = useState(0);
  const s = steps[i]!;
  return <div className="py-4">
    <p className="text-xs text-muted-foreground">{i + 1} of {steps.length}</p>
    <div className="mt-2 rounded-3xl border border-border bg-card p-5 shadow-soft"><h3 className="font-display text-xl text-primary-strong">{s.title}</h3><p className="mt-2 text-sm leading-relaxed text-graphite">{s.text}</p></div>
    <div className="mt-4 flex gap-2">
      <Button variant="ghost" disabled={i === 0} onClick={() => setI(i - 1)} className="min-h-12 flex-1 rounded-full border border-border">Back</Button>
      <Button disabled={i === steps.length - 1} onClick={() => setI(i + 1)} className="min-h-12 flex-1 rounded-full">Next</Button>
    </div>
  </div>;
}

export const groundingSteps = [
  { title: "5 things you can see", text: "Let your eyes wander slowly. A color, a shape, a patch of light." },
  { title: "4 things you can feel", text: "Your feet on the floor, the fabric of your sleeve, the air on your hands." },
  { title: "3 things you can hear", text: "Near or far. A hum, a breath, a distant sound." },
  { title: "2 things you can smell", text: "Or two smells you love, remembered." },
  { title: "1 thing you can taste", text: "Or take a slow sip of water. You're here, right now." },
];
export const oilSteps = [
  { title: "Warm it", text: "Place a little lotion or balm in your palms and rub them together slowly." },
  { title: "Slow circles", text: "Trace small, gentle circles on the back of each hand." },
  { title: "Each finger", text: "Glide from the base of each finger to its tip, like smoothing a ribbon." },
  { title: "Cuticle kindness", text: "Press a drop of balm into each cuticle with a soft, round touch." },
  { title: "Rest", text: "Cup your hands together and notice the warmth. This is care." },
];
export const stretchSteps = [
  { title: "Open fan", text: "Spread your fingers wide, hold for 5 slow breaths, then relax." },
  { title: "Prayer stretch", text: "Press palms together at your chest and lower them gently until your wrists feel a soft stretch." },
  { title: "Wrist circles", text: "Make slow circles with both wrists, five each way. Let your forearms soften." },
];
export function StepsActivity({ steps }: { steps: { title: string; text: string }[] }) { return <Steps steps={steps} />; }

type Loop = "rain" | "stream" | "chimes";
export function Soundscapes({ muted }: { muted: boolean }) {
  const [playing, setPlaying] = useState<Loop | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const stop = () => { stopRef.current?.(); stopRef.current = null; setPlaying(null); };
  useEffect(() => { if (muted) stop(); }, [muted]);
  useEffect(() => () => { stopRef.current?.(); void ctxRef.current?.close(); }, []);
  const play = (loop: Loop) => {
    stop();
    if (muted) return;
    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    void ctx.resume();
    const out = ctx.createGain(); out.gain.value = 0.15; out.connect(ctx.destination);
    if (loop === "chimes") {
      const notes = [523, 659, 784, 880, 1047];
      const ring = () => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = notes[Math.floor(Math.random() * notes.length)]!;
        g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
        o.connect(g).connect(out); o.start(); o.stop(ctx.currentTime + 3);
      };
      ring(); const t = setInterval(ring, 1400);
      stopRef.current = () => { clearInterval(t); out.disconnect(); };
    } else {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = loop === "rain" ? "highpass" : "lowpass"; f.frequency.value = loop === "rain" ? 1200 : 600;
      src.connect(f).connect(out); src.start();
      stopRef.current = () => { src.stop(); out.disconnect(); };
    }
    setPlaying(loop);
  };
  const loops: { id: Loop; label: string }[] = [{ id: "rain", label: "Rain on Studio Roof" }, { id: "stream", label: "Forest Stream" }, { id: "chimes", label: "Soft Wind Chimes" }];
  return <div className="grid gap-3 py-4">
    {muted && <p className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary-strong">Muted in Quiet Mode. Turn Quiet Mode off on Home to listen.</p>}
    {loops.map((l) => <Button key={l.id} variant="ghost" disabled={muted} aria-pressed={playing === l.id} onClick={() => playing === l.id ? stop() : play(l.id)} className={`min-h-14 justify-between rounded-2xl border px-4 ${playing === l.id ? "border-stream bg-stream-soft" : "border-border bg-card"}`}><span>{l.label}</span>{playing === l.id ? <Pause /> : <Play />}</Button>)}
  </div>;
}

const tileColors = Array.from({ length: 9 }, (_, i) => `color-mix(in oklab, var(--stream) ${100 - i * 12}%, var(--honey))`);
export function WatercolorSorter() {
  const initial = useMemo(() => { const mid = [1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5); return [0, ...mid, 8]; }, []);
  const [order, setOrder] = useState(initial);
  const [picked, setPicked] = useState<number | null>(null);
  const sorted = order.every((v, i) => v === i);
  const tap = (pos: number) => {
    if (pos === 0 || pos === 8) return;
    if (picked === null) return setPicked(pos);
    const next = [...order]; [next[picked], next[pos]] = [next[pos]!, next[picked]!]; setOrder(next); setPicked(null);
  };
  return <div className="py-4">
    <p className="text-sm text-graphite">Tap two tiles to swap them. The ends stay put. No timer, no rush.</p>
    <div className="mt-4 grid grid-cols-3 gap-2">{order.map((c, pos) => <button key={pos} aria-label={`Tile ${pos + 1}${pos === 0 || pos === 8 ? ", fixed" : ""}`} aria-pressed={picked === pos} onClick={() => tap(pos)} style={{ background: tileColors[c] }} className={`aspect-square min-h-12 rounded-2xl shadow-soft transition-transform ${picked === pos ? "scale-95 ring-2 ring-primary" : ""} ${pos === 0 || pos === 8 ? "opacity-90" : ""}`} />)}</div>
    <p className="mt-4 text-center font-display text-lg text-primary-strong" aria-live="polite">{sorted ? "In harmony. What a soft little moment." : "\u00a0"}</p>
    {sorted && <Button variant="ghost" onClick={() => setOrder([0, ...[1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5), 8])} className="mt-2 min-h-12 w-full rounded-full border border-border">Mix again</Button>}
  </div>;
}
