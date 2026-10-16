import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Eraser, Leaf, Moon, Smartphone, SmartphoneNfc, Sun, Volume2, VolumeX, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BubbleWrap, TraceCanvas, useSoftFeedback, type Surface } from "@/components/buddy/TexturePad";
import { GroundingSheet, type GroundingActivity } from "@/components/buddy/GroundingSheet";
import { useSensoryControls } from "@/components/buddy/SensoryProvider";

export const Route = createFileRoute("/texture")({
  head: () => ({ meta: [
    { title: "Sensory Pad · Rest Your Hands | Project Buddy" },
    { name: "description", content: "Glide, trace, pop and rake gentle textures to give restless hands a safe, soothing place to land." },
    { property: "og:title", content: "Sensory Pad · Rest Your Hands" },
    { property: "og:description", content: "Soft watercolor textures for restless hands — no timers, no scores." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: TexturePage,
});

const SURFACES: { id: Surface; name: string; hint: string; tint: string }[] = [
  { id: "pebble", name: "River Pebble", hint: "Glide", tint: "bg-stream-soft border-stream/30" },
  { id: "moss", name: "Moss & Clover", hint: "Gentle drag", tint: "bg-primary-soft border-primary/30" },
  { id: "bubble", name: "Bubble Seed Wrap", hint: "Pop & bloom", tint: "bg-honey-soft border-honey/40" },
  { id: "sand", name: "Sand Garden", hint: "Rake & swirl", tint: "bg-secondary border-wood/40" },
];

function TexturePage() {
  const navigate = useNavigate();
  const { sensoryQuiet } = useSensoryControls();
  const [surface, setSurface] = useState<Surface>("pebble");
  const [sound, setSound] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [evening, setEvening] = useState(false);
  const [clearKey, setClearKey] = useState(0);
  const [activity, setActivity] = useState<GroundingActivity>(null);
  const feedback = useSoftFeedback(sound, haptics, sensoryQuiet);
  const home = () => navigate({ to: "/" });
  const surfaceBg = SURFACES.find((s) => s.id === surface)?.tint ?? "bg-stream-soft border-stream/30";

  return <div className={`paper-canvas flex min-h-dvh flex-col bg-background text-foreground ${evening ? "pb-evening" : ""} ${sensoryQuiet ? "quiet" : ""}`}>
    <main className="texture-layout mx-auto grid w-full max-w-[480px] flex-1 gap-3 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Return to Home" onClick={home} className="h-12 w-12 shrink-0 rounded-full border border-border bg-card/70"><ArrowLeft /></Button>
        <div className="min-w-0 flex-1"><h1 className="font-display text-xl leading-tight">Sensory Pad <span className="text-honey">·</span> Rest Your Hands</h1></div>
        <div className="breath-ring grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-stream/40 bg-stream-soft" role="img" aria-label="Slow breathing guide, about 11 seconds per breath"><Leaf className="h-5 w-5 text-stream" strokeWidth={1.4} /></div>
      </header>

      <div className="flex flex-wrap items-center gap-2" aria-label="Sensory settings">
        <div className="flex rounded-full border border-border bg-card/70 p-0.5">
          <Button variant="ghost" aria-pressed={sound && !sensoryQuiet} disabled={sensoryQuiet} onClick={() => setSound((s) => !s)} aria-label="Soft sounds" className="h-12 gap-1.5 rounded-full px-3 text-xs aria-pressed:bg-primary-soft aria-pressed:text-primary-strong">{sound && !sensoryQuiet ? <Volume2 /> : <VolumeX />}Sound</Button>
          <Button variant="ghost" aria-pressed={haptics} onClick={() => setHaptics((h) => !h)} aria-label="Gentle vibration" className="h-12 gap-1.5 rounded-full px-3 text-xs aria-pressed:bg-primary-soft aria-pressed:text-primary-strong">{haptics ? <SmartphoneNfc /> : <Smartphone />}Haptics</Button>
        </div>
        <Button variant="ghost" aria-pressed={evening} onClick={() => setEvening((e) => !e)} className="h-12 gap-1.5 rounded-full border border-border bg-card/70 px-3 text-xs aria-pressed:bg-primary-soft aria-pressed:text-primary-strong">{evening ? <Moon /> : <Sun />}Evening contrast</Button>
      </div>

      <div className="grid grid-cols-2 gap-2 min-[360px]:grid-cols-4" role="radiogroup" aria-label="Choose a texture">
        {SURFACES.map((s) => <Button key={s.id} variant="ghost" role="radio" aria-checked={surface === s.id} onClick={() => setSurface(s.id)}
          className={`texture-tab h-16 flex-col gap-0.5 whitespace-normal rounded-2xl border px-1 text-center leading-tight ${s.tint} aria-checked:border-primary-strong aria-checked:ring-2 aria-checked:ring-primary/30`}>
          <span className="text-[11px] font-semibold text-graphite">{s.name}</span><span className="text-[10px] font-normal text-muted-foreground">{s.hint}</span></Button>)}
      </div>

      <section className={`relative min-h-0 overflow-hidden rounded-3xl border shadow-soft ${surfaceBg}`} aria-label="Tactile canvas">
        {surface === "bubble" ? <BubbleWrap onPop={() => feedback("pop")} /> : <TraceCanvas surface={surface} quiet={sensoryQuiet} clearKey={clearKey} onTouch={() => feedback("touch")} />}
        {surface === "sand" && <Button variant="ghost" onClick={() => setClearKey((k) => k + 1)} className="absolute right-3 top-3 h-12 gap-1.5 rounded-full bg-card/80 px-3 text-xs"><Eraser />Smooth the sand</Button>}
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[11px] text-muted-foreground">Use one hand or both — there's no wrong way.</p>
      </section>

      <footer className="grid gap-2">
      <p className="text-center font-display text-sm italic text-primary-strong" role="status">Hands are safe and grounded right now.</p>
      <Button variant="ghost" onClick={() => setActivity("stream")} className="h-auto min-h-12 gap-2 whitespace-normal rounded-full text-stream hover:bg-stream-soft hover:text-stream"><Wind />Switch to Guided Breathing</Button>
      <Button onClick={home} className="h-auto min-h-[52px] whitespace-normal rounded-full px-3 text-[15px] font-semibold shadow-soft hover:bg-primary-strong">I feel centered · Return Home</Button>
      </footer>
    </main>
    <div className={sensoryQuiet ? "quiet" : ""}><GroundingSheet activity={activity} onClose={() => setActivity(null)} /></div>
  </div>;
}
