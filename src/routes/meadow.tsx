import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Flower2, Leaf, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSensoryControls } from "@/components/buddy/SensoryProvider";
import { addBloom, readBlooms, REFLECTIONS, REFLECTION_MS, TIMERS } from "@/lib/meadow";
import meadow from "@/assets/healing-meadow.jpg";
import { CompanionFigure } from "@/components/buddy/CompanionFigure";
import { useCompanion } from "@/lib/companion";

export const Route = createFileRoute("/meadow")({
  head: () => ({ meta: [
    { title: "Healing Meadow · Rest Your Hands | Project Buddy" },
    { name: "description", content: "A hands-free watercolor meadow to rest, breathe, and let a new wildflower bloom — growth that never resets." },
    { property: "og:title", content: "Healing Meadow · Project Buddy" },
    { property: "og:description", content: "Rest under the willow with your companion. Every pause blooms a wildflower that stays." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MeadowPage,
});

type Spot = "boulder" | "willow" | "patch" | "stream";
const SPOTS: { id: Spot; label: string; note: string; pos: string }[] = [
  { id: "boulder", label: "Sunlit Boulder", note: "Warm stone, quiet thoughts. Let your shoulders soften.", pos: "left-[14%] top-[64%]" },
  { id: "willow", label: "Mossy Willow", note: "Cool shade and steady roots. You are held here.", pos: "left-[22%] top-[38%]" },
  { id: "patch", label: "Wildflower Patch", note: "Soft colors all around. Let your eyes wander slowly.", pos: "left-[20%] top-[86%]" },
  { id: "stream", label: "Stream Bank", note: "Cool water drifting by. Nothing to hold onto.", pos: "left-[84%] top-[66%]" },
];
type Sound = "breeze" | "stream" | "rain" | "silent";
const SOUNDS: { id: Sound; label: string }[] = [
  { id: "breeze", label: "Meadow Breeze & Grass" }, { id: "stream", label: "Forest Stream" },
  { id: "rain", label: "Summer Rain on Leaves" }, { id: "silent", label: "Silent Sanctuary" },
];

function useAmbient(sound: Sound, volume: number, muted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  useEffect(() => {
    if (sound === "silent" || muted) return;
    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx; void ctx.resume();
    const out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination);
    out.gain.linearRampToValueAtTime(volume * 0.25, ctx.currentTime + 1.5);
    gainRef.current = out;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = sound === "rain" ? "highpass" : sound === "stream" ? "lowpass" : "bandpass";
    f.frequency.value = sound === "rain" ? 1400 : sound === "stream" ? 650 : 400;
    src.connect(f).connect(out);
    let lfo: OscillatorNode | null = null;
    if (sound === "breeze") { // slow swelling wind
      lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
      const depth = ctx.createGain(); depth.gain.value = 250; lfo.connect(depth).connect(f.frequency); lfo.start();
    }
    src.start();
    return () => { src.stop(); lfo?.stop(); out.disconnect(); gainRef.current = null; };
  }, [sound, muted]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (gainRef.current) gainRef.current.gain.value = volume * 0.25; }, [volume]);
  useEffect(() => () => { void ctxRef.current?.close(); }, []);
}

function MeadowPage() {
  const navigate = useNavigate();
  const [companion] = useCompanion();
  const { quiet, sensoryQuiet, toggleQuiet } = useSensoryControls();
  const [blooms, setBlooms] = useState(0);
  const [spot, setSpot] = useState<Spot>("willow");
  const [reflection, setReflection] = useState(0);
  const [sound, setSound] = useState<Sound>("silent");
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [timer, setTimer] = useState<string>("open");
  const [left, setLeft] = useState<number | null>(null);
  const [blossomed, setBlossomed] = useState(false);
  useEffect(() => { setBlooms(readBlooms()); }, []);
  useEffect(() => { if (sensoryQuiet) setSound("silent"); }, [sensoryQuiet]);
  useEffect(() => {
    if (sensoryQuiet) return;
    const t = setInterval(() => setReflection((r) => (r + 1) % REFLECTIONS.length), REFLECTION_MS);
    return () => clearInterval(t);
  }, [sensoryQuiet]);
  useEffect(() => {
    if (left === null) return;
    if (left <= 0) { setLeft(null); setBlooms(addBloom()); setBlossomed(true); return; }
    const t = setTimeout(() => setLeft((s) => (s ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  useAmbient(sound, volume, muted || sensoryQuiet);

  const pickTimer = (id: string) => {
    setTimer(id); setBlossomed(false);
    const s = TIMERS.find((t) => t.id === id)?.seconds ?? null;
    setLeft(s);
  };
  const current = SPOTS.find((s) => s.id === spot)!;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const home = () => navigate({ to: "/" });

  return <div className={`paper-canvas min-h-dvh ${sensoryQuiet ? "quiet" : ""}`}>
    <main className="mx-auto grid w-full max-w-[560px] gap-4 px-4 pt-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <Button variant="ghost" onClick={home} aria-label="Return to Home" className="h-12 gap-1.5 rounded-full border border-border bg-card/70 px-3 text-xs"><ArrowLeft /><span className="hidden min-[400px]:inline">Return to Home</span></Button>
        <h1 className="text-center font-display text-xl">Healing Meadow</h1>
        <Button variant="ghost" size="icon" onClick={toggleQuiet} aria-pressed={quiet} aria-label="Quiet Mode" className="h-12 w-12 rounded-full border border-border bg-card/70 aria-pressed:bg-primary-soft aria-pressed:text-primary-strong">{sensoryQuiet ? <VolumeX /> : <Leaf />}</Button>
      </header>
      <p className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-blush-soft px-3 py-1.5 text-center text-[12px] font-medium text-graphite" role="status"><Flower2 className="h-4 w-4 shrink-0 text-blush" />{blooms} Wildflower{blooms === 1 ? "" : "s"} Bloomed · Never resets</p>

      <section className="relative aspect-[3/2] overflow-hidden rounded-3xl border border-border shadow-soft" aria-label="Meadow scene">
        <img src={meadow} alt="A hand-painted sunlit meadow with a willow tree, a mossy boulder, wildflowers and a winding stream" width={1536} height={1024} className="meadow-drift absolute inset-0 h-full w-full object-cover" />
        <span className="buddy-settle absolute bottom-[8%] left-[30%] block aspect-square w-[22%]"><CompanionFigure color={companion.color} accessory={companion.accessory} alt={`${companion.name.trim() || "Buddy"}, resting peacefully under the willow`} className="buddy-rest h-full w-full" /></span>
        {Array.from({ length: Math.min(blooms, 24) }, (_, i) => <Flower2 key={i} aria-hidden className="meadow-flower absolute h-4 w-4 text-honey" strokeWidth={1.4} style={{ left: `${45 + ((i * 37) % 50)}%`, bottom: `${3 + ((i * 17) % 14)}%`, animationDelay: `${-i * 0.7}s` }} />)}
        {SPOTS.map((s) => <button key={s.id} aria-label={`Rest at ${s.label}`} aria-pressed={spot === s.id} onClick={() => setSpot(s.id)} className={`absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ${s.pos}`}><span className={`h-3.5 w-3.5 rounded-full border-2 border-card ${spot === s.id ? "bg-honey ring-4 ring-honey/40" : "bg-card/80"}`} /></button>)}
        {blossomed && <div className="meadow-bloom absolute inset-x-4 top-4 rounded-2xl bg-card/95 px-4 py-3 text-center shadow-soft"><Flower2 className="mx-auto mb-1 h-7 w-7 text-honey" /><p className="font-display text-sm">A buttercup blossomed in your meadow. Thank you for resting your hands.</p></div>}
      </section>

      <div className="flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Resting spots">
        {SPOTS.map((s) => <Button key={s.id} variant="ghost" role="radio" aria-checked={spot === s.id} onClick={() => setSpot(s.id)} className="h-12 rounded-full border border-border bg-card/70 px-4 text-xs aria-checked:border-primary aria-checked:bg-primary-soft aria-checked:text-primary-strong">{s.label}</Button>)}
      </div>
      <p className="text-center text-sm text-graphite">{current.note}</p>

      <div className="rounded-2xl border border-primary/15 bg-primary-soft/60 px-5 py-4 text-center">
        <p key={sensoryQuiet ? "static" : reflection} className="meadow-reflection font-display text-[16px] italic leading-relaxed text-primary-strong">{sensoryQuiet ? REFLECTIONS[2] : REFLECTIONS[reflection]}</p>
      </div>

      <section className="rounded-3xl border border-stream/20 bg-stream-soft/70 p-4" aria-labelledby="sound-title">
        <h2 id="sound-title" className="mb-3 font-display text-lg">Ambient sound</h2>
        {sensoryQuiet && <p className="mb-3 rounded-2xl bg-card/80 px-3 py-2 text-xs text-primary-strong">Quiet Mode is on, so the meadow stays silent.</p>}
        <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2" role="radiogroup" aria-label="Soundscape">
          {SOUNDS.map((s) => <Button key={s.id} variant="ghost" role="radio" aria-checked={sound === s.id} disabled={sensoryQuiet && s.id !== "silent"} onClick={() => setSound(s.id)} className="h-auto min-h-12 whitespace-normal rounded-2xl border border-border bg-card/80 px-3 text-xs aria-checked:border-stream aria-checked:bg-card aria-checked:text-stream">{s.label}</Button>)}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" aria-pressed={muted} aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((m) => !m)} className="h-12 w-12 shrink-0 rounded-full bg-card/80">{muted ? <VolumeX /> : <Volume2 />}</Button>
          <Slider value={[volume * 100]} onValueChange={(v) => setVolume((v[0] ?? 50) / 100)} max={100} step={1} thumbLabel="Volume" aria-label="Volume" disabled={sensoryQuiet} className="flex-1" />
        </div>
      </section>

      <section aria-labelledby="timer-title">
        <div className="mb-2 flex items-center justify-between"><h2 id="timer-title" className="font-display text-lg">Rest for a while</h2>{left !== null && <span className="text-sm tabular-nums text-graphite" role="timer">{fmt(left)}</span>}</div>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Session length">
          {TIMERS.map((t) => <Button key={t.id} variant="ghost" role="radio" aria-checked={timer === t.id} onClick={() => pickTimer(t.id)} className="h-12 rounded-full border border-border bg-card/70 px-4 text-xs aria-checked:border-honey aria-checked:bg-honey-soft">{t.id === "open" ? "Open-ended (No timer)" : t.label}</Button>)}
        </div>
      </section>
    </main>
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <Button onClick={home} className="mx-auto flex h-auto min-h-[52px] w-full max-w-[560px] whitespace-normal rounded-full text-[15px] font-semibold shadow-soft hover:bg-primary-strong">I feel grounded · Return Home</Button>
    </div>
  </div>;
}
