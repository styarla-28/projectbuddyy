import { useEffect, useState } from "react";
import { Flower2, Pause, Play, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { breathingMoment } from "@/components/buddy/breathing";
import { bloom } from "@/lib/meadow";
import sanctuary from "@/assets/buddy-sanctuary.jpg";
import buddy from "@/assets/moss-buddy.png";

export type GroundingActivity = "breathing" | "stream" | "texture" | "meadow" | null;

export function GroundingSheet({ activity, onClose }: { activity: GroundingActivity; onClose: () => void }) {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [touched, setTouched] = useState<number[]>([]);
  useEffect(() => { setRunning(false); setSeconds(0); setTouched([]); }, [activity]);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);
  const isBreathing = activity === "breathing" || activity === "stream";
  const moment = breathingMoment(seconds, activity === "stream");
  const title = activity === "stream" ? "Breathe with stream" : activity === "breathing" ? "Box Breathing" : activity === "texture" ? "Tactile Texture Pad" : "Healing Meadow";
  return <Sheet open={activity !== null} onOpenChange={(open) => { if (!open) { if (isBreathing && seconds >= 15) bloom(); onClose(); } }}>
    <SheetContent side="bottom" className="max-h-[94dvh] overflow-y-auto rounded-t-3xl bg-card px-5 pt-14 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md">
        <SheetHeader className="px-0 text-center">
          <SheetTitle className="font-display text-2xl">{title}</SheetTitle>
          <SheetDescription>{activity === "stream" ? "In for 4, hold for 7, out for 8. Shorten any breath or hold to feel comfortable." : activity === "breathing" ? "A little space for a slower breath. Go at your own pace." : activity === "texture" ? "A soft place for your hands to wander." : "Nothing to earn. Nothing to catch up on. Just a moment here."}</SheetDescription>
        </SheetHeader>
        {isBreathing ? <div className="flex flex-col items-center gap-5 py-6">
          <div className="breathing-pebble grid h-40 w-40 place-items-center border-2 border-stream/40 bg-stream-soft text-center text-primary-strong"><div><p className="font-display text-xl" aria-live="polite">{moment.label}</p><p className="mt-2 text-2xl tabular-nums" role="timer" aria-label="Seconds remaining">{moment.remaining}</p></div></div>
          <Button className="h-12 rounded-full px-6" onClick={() => setRunning((r) => !r)}>{running ? <Pause /> : <Play />}{running ? "Pause breathing" : "Begin breathing"}</Button>
        </div> : activity === "texture" ? <div className="my-6 grid grid-cols-5 gap-2 sm:gap-3" aria-label="Texture pad">{Array.from({ length: 20 }, (_, i) => <Button key={i} aria-label={`Texture pebble ${i + 1}`} aria-pressed={touched.includes(i)} variant="ghost" onClick={() => setTouched((t) => t.includes(i) ? t.filter((n) => n !== i) : [...t, i])} className={`texture-pebble h-12 min-w-12 rounded-2xl border border-honey/30 ${touched.includes(i) ? "bg-honey/45 shadow-inner" : "bg-honey-soft shadow-soft"}`}><span className="h-2 w-2 rounded-full bg-honey/70" /></Button>)}</div> : <div className="py-6 text-center text-primary-strong">
          <div className="meadow-visual relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-soft"><img src={sanctuary} alt="A sunlit cottage sanctuary opening onto a peaceful flowering meadow" className="h-full w-full object-cover" /><img src={buddy} alt="Your serene moss companion resting nearby" className="buddy-rest absolute bottom-3 left-1/2 w-28 -translate-x-1/2" /><Flower2 className="meadow-flower absolute bottom-5 left-5 h-9 w-9 text-honey" strokeWidth={1.2} /><Sprout className="absolute bottom-4 right-5 h-8 w-8 text-primary-strong" strokeWidth={1.2} /></div>
          <p className="mt-5 font-display text-xl">You can simply be here.</p>
        </div>}
      </div>
    </SheetContent>
  </Sheet>;
}
