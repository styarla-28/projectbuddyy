import { useEffect, useState } from "react";
import { Flower2, Pause, Play, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export type GroundingActivity = "breathing" | "texture" | "meadow" | null;
const phases = ["Breathe in", "Hold gently", "Breathe out", "Rest"];

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
  const title = activity === "breathing" ? "Box Breathing" : activity === "texture" ? "Tactile Texture Pad" : "Healing Meadow";
  return <Sheet open={activity !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
    <SheetContent side="bottom" className="rounded-t-3xl bg-background px-6 pb-8">
      <div className="mx-auto max-w-md">
        <SheetHeader className="px-0 text-center">
          <SheetTitle className="font-display text-2xl">{title}</SheetTitle>
          <SheetDescription>{activity === "breathing" ? "A little space for a slower breath. Go at your own pace." : activity === "texture" ? "A soft place for your hands to wander." : "Nothing to earn. Nothing to catch up on. Just a moment here."}</SheetDescription>
        </SheetHeader>
        {activity === "breathing" ? <div className="flex flex-col items-center gap-5 py-6">
          <div className="grid h-40 w-40 place-items-center rounded-[40px] border-2 border-stream/40 bg-stream-soft text-center text-stream"><div><p className="font-display text-xl">{phases[Math.floor(seconds / 4) % 4]}</p><p className="mt-2 text-2xl tabular-nums">{4 - seconds % 4}</p></div></div>
          <Button className="h-12 rounded-full px-6" onClick={() => setRunning((r) => !r)}>{running ? <Pause /> : <Play />}{running ? "Pause breathing" : "Begin breathing"}</Button>
        </div> : activity === "texture" ? <div className="my-6 grid grid-cols-5 gap-3" aria-label="Texture pad">{Array.from({ length: 20 }, (_, i) => <Button key={i} aria-label={`Texture pebble ${i + 1}`} aria-pressed={touched.includes(i)} variant="ghost" onClick={() => setTouched((t) => t.includes(i) ? t.filter((n) => n !== i) : [...t, i])} className={`texture-pebble h-12 min-w-12 rounded-2xl border border-honey/30 ${touched.includes(i) ? "bg-honey/45 shadow-inner" : "bg-honey-soft shadow-soft"}`}><span className="h-2 w-2 rounded-full bg-honey/70" /></Button>)}</div> : <div className="flex flex-col items-center gap-4 py-8 text-primary"><Flower2 className="h-20 w-20" strokeWidth={1} /><p className="font-display text-xl">You can simply be here.</p><Sprout className="h-8 w-8" strokeWidth={1.2} /></div>}
      </div>
    </SheetContent>
  </Sheet>;
}
