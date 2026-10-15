import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Flower2, Leaf, Moon, Sprout, Sun, Volume2, VolumeX, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CozyRoom } from "@/components/buddy/CozyRoom";
import { CheckInSheet } from "@/components/buddy/CheckInSheet";
import { BottomNav } from "@/components/buddy/BottomNav";
import { GroundingSheet, type GroundingActivity } from "@/components/buddy/GroundingSheet";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Project Buddy · Your quiet sanctuary" },
    { name: "description", content: "A warm, gentle sanctuary to pause, rest your hands, and find grounding during skin-picking urges." },
    { property: "og:title", content: "Project Buddy · Your quiet sanctuary" },
    { property: "og:description", content: "Rest with your companion, take a breath, and find a little calm at your own pace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

function Home() {
  const [quiet, setQuiet] = useState(false);
  const [checkIn, setCheckIn] = useState(false);
  const [activity, setActivity] = useState<GroundingActivity>(null);
  const [hour, setHour] = useState(12);
  useEffect(() => { setHour(new Date().getHours()); }, []);
  useEffect(() => {
    document.body.classList.toggle("quiet", quiet);
    return () => document.body.classList.remove("quiet");
  }, [quiet]);
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return <div className={`paper-canvas min-h-dvh pb-28 ${quiet ? "quiet" : ""}`}>
    <main className="mx-auto w-full max-w-[480px] px-5 pt-7 sm:pt-9">
      <header className="flex items-start justify-between gap-3">
        <div><div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary"><Sprout className="h-4 w-4" strokeWidth={1.5} /><span>Project Buddy</span></div><h1 className="font-display text-[28px] leading-tight">{greeting}<span className="text-honey">.</span></h1><p className="mt-1.5 text-[13px] text-graphite">There's room to slow down here.</p></div>
        <Button variant="ghost" onClick={() => setQuiet((q) => !q)} aria-pressed={quiet} aria-label={quiet ? "Turn quiet mode off" : "Turn quiet mode on"} className="mt-1 h-12 shrink-0 gap-2 rounded-full border border-border bg-card/60 px-3 text-xs text-graphite hover:bg-secondary aria-pressed:bg-primary-soft aria-pressed:text-primary-strong">{quiet ? <VolumeX /> : <Volume2 />}<span>Quiet {quiet ? "on" : "mode"}</span></Button>
      </header>
      <div className="mb-4 mt-5 flex items-center justify-between"><span className="inline-flex items-center gap-1.5 rounded-full bg-blush-soft px-3 py-1.5 text-[11px] font-medium text-graphite"><Sun className="h-3.5 w-3.5 text-blush" />Day 4 Calm</span><span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">{quiet ? <Moon className="h-3 w-3" /> : <Leaf className="h-3 w-3" />}{quiet ? "A quieter kind of company" : "Your own little sanctuary"}</span></div>
      <CozyRoom />
      <Button onClick={() => setCheckIn(true)} className="pause-action mt-5 h-[54px] w-full gap-2.5 whitespace-normal rounded-full px-3 text-[14px] font-semibold shadow-soft hover:bg-primary-strong active:scale-[0.98]"><Leaf className="h-5 w-5" strokeWidth={1.5} />Feeling an urge? Pause for a moment</Button>
      <section className="mt-6" aria-labelledby="grounding-title">
        <div className="mb-3 flex items-center justify-between"><h2 id="grounding-title" className="font-display text-lg">A little grounding</h2><span className="text-[11px] text-muted-foreground">At your own pace</span></div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" onClick={() => setActivity("breathing")} className="grounding-card relative h-[116px] flex-col items-start justify-between gap-2 whitespace-normal rounded-2xl border border-stream/15 bg-stream-soft px-4 py-4 text-left hover:bg-stream-soft/70"><Wind className="h-7 w-7 text-stream" strokeWidth={1.4} /><span><span className="block text-[13px] font-semibold text-graphite">Box Breathing</span><span className="mt-1 block text-[11px] font-normal text-muted-foreground">One breath at a time</span></span><ArrowUpRight className="absolute right-3 top-4 h-4 w-4 text-stream/70" /></Button>
          <Button variant="ghost" onClick={() => setActivity("texture")} className="grounding-card relative h-[116px] flex-col items-start justify-between gap-2 whitespace-normal rounded-2xl border border-honey/20 bg-honey-soft px-4 py-4 text-left hover:bg-honey-soft/70"><span className="texture-icon grid grid-cols-3 gap-1 text-honey" aria-hidden>{Array.from({ length: 9 }, (_, i) => <span key={i} className="h-[5px] w-[5px] rounded-full bg-current" />)}</span><span><span className="block text-[13px] font-semibold text-graphite">Tactile Texture Pad</span><span className="mt-1 block text-[11px] font-normal text-muted-foreground">A soft landing for hands</span></span><ArrowUpRight className="absolute right-3 top-4 h-4 w-4 text-honey" /></Button>
        </div>
      </section>
      <Button variant="ghost" onClick={() => setActivity("meadow")} className="meadow-card mt-4 h-[82px] w-full justify-start gap-4 whitespace-normal rounded-2xl border border-primary/15 bg-primary-soft/60 px-5 text-left hover:bg-primary-soft"><span className="relative flex h-12 w-12 shrink-0 items-center justify-center"><Flower2 className="h-10 w-10 text-primary" strokeWidth={1.1} /><Sprout className="absolute -bottom-1 -right-1 h-5 w-5 text-primary-strong" strokeWidth={1.3} /></span><span className="flex-1"><span className="block font-display text-[17px] text-primary-strong">Visit Healing Meadow</span><span className="mt-1 block text-[11px] font-normal text-graphite">A small place for gentle growth</span></span><ArrowUpRight className="h-4 w-4 text-primary" /></Button>
      <p className="mt-5 text-center font-display text-xs italic text-muted-foreground">Small pauses count, too.</p>
    </main>
    <BottomNav />
    <div className={quiet ? "quiet" : ""}><CheckInSheet open={checkIn} onOpenChange={setCheckIn} /><GroundingSheet activity={activity} onClose={() => setActivity(null)} /></div>
  </div>;
}
