import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Flower2, Hand, Leaf, Wind, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { GroundingActivity } from "@/components/buddy/GroundingSheet";

const locations = ["Fingers & nails", "Cuticles", "Face & jaw", "Shoulders & arms", "Just anxious"];
const emotions = ["Restless", "Overwhelmed", "Bored", "Zoned out"];
const levels = ["Whispering", "Softly there", "Noticeable", "Loud", "Very loud"];
const activities = [
  { id: "stream" as const, title: "Breathe with stream", detail: "A gentle 4–7–8 breath", icon: Wind, tint: "bg-stream-soft", ink: "text-stream" },
  { id: "texture" as const, title: "Touch something soft / textured", detail: "A soft landing for your hands", icon: Hand, tint: "bg-honey-soft", ink: "text-honey" },
  { id: "meadow" as const, title: "Rest in the Healing Meadow", detail: "Simply rest. Nothing to do.", icon: Flower2, tint: "bg-primary-soft", ink: "text-primary" },
];

export function CheckInSheet({ open, onOpenChange, onBeginActivity }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBeginActivity: (activity: Exclude<GroundingActivity, null>) => void;
}) {
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(1);
  const [feelings, setFeelings] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Exclude<GroundingActivity, null>>("stream");
  const [toolsOnly, setToolsOnly] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const showingTools = toolsOnly || step === 2;
  const displayedStep = showingTools ? 2 : step;
  const changeStep = (next: number) => {
    setToolsOnly(false);
    setStep(next);
    contentRef.current?.scrollTo({ top: 0 });
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const close = (nextOpen: boolean) => {
    if (!nextOpen) setToolsOnly(false);
    onOpenChange(nextOpen);
  };
  const skipToTools = () => {
    setToolsOnly(true);
    contentRef.current?.scrollTo({ top: 0 });
    requestAnimationFrame(() => headingRef.current?.focus());
  };
  const chipClass = (selected: boolean) => `min-h-12 rounded-2xl border px-4 py-3 text-sm whitespace-normal font-medium transition-colors active:scale-[0.98] ${selected ? "border-primary bg-honey-soft text-primary-strong hover:bg-honey-soft hover:text-primary-strong" : "border-border bg-card text-graphite hover:bg-secondary hover:text-graphite"}`;

  return <Sheet open={open} onOpenChange={close}>
    <SheetContent ref={contentRef} side="bottom" showCloseButton={false} className="pause-sheet max-h-[94dvh] overflow-y-auto rounded-t-3xl border-border bg-background px-5 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:px-7">
      <div className="mx-auto mb-1 h-1 w-10 rounded-full bg-border" aria-hidden="true" />
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-xs font-semibold text-primary-strong"><Leaf className="h-4 w-4" strokeWidth={1.5} />A meadow pause</span>
        <Button variant="ghost" onClick={() => close(false)} className="h-12 rounded-full px-3 text-graphite"><X className="h-4 w-4" />Close</Button>
      </div>
      <SheetHeader className="mt-2 text-left">
        <div className="mb-2 flex items-center gap-3" aria-label={`Step ${displayedStep + 1} of 3`}>
          <span className="flex gap-2" aria-hidden="true">{[0, 1, 2].map((stone) => <span key={stone} className={`pause-stone h-2.5 w-5 border border-primary/30 ${stone <= displayedStep ? "bg-primary" : "bg-primary-soft"}`} />)}</span>
          <span className="text-xs text-muted-foreground">{displayedStep + 1} of 3</span>
        </div>
        <SheetTitle ref={headingRef} tabIndex={-1} className="font-display text-[26px] font-medium leading-tight outline-none">{showingTools ? "What does your body need?" : step === 0 ? "Pause & Notice" : "A little room to feel"}</SheetTitle>
        <SheetDescription className="text-sm leading-relaxed text-graphite">{showingTools ? "A breath, a soft touch, or a quiet place to rest." : step === 0 ? "Where are you feeling tension or restless energy?" : "How loud is this urge right now?"}</SheetDescription>
      </SheetHeader>

      {!showingTools && step === 0 && <div className="my-6 flex flex-wrap gap-2.5" role="group" aria-label="Where tension is landing">
        {locations.map((option) => <Button key={option} variant="ghost" aria-pressed={location === option} onClick={() => setLocation(location === option ? null : option)} className={chipClass(location === option)}>{option}</Button>)}
      </div>}

      {!showingTools && step === 1 && <div className="my-5">
        <div className="py-3">
          <p className="mb-3 flex items-center justify-center gap-2 font-display text-xl text-primary-strong" aria-live="polite"><Leaf className="h-5 w-5" strokeWidth={1.4} />{levels[intensity - 1]}<span className="font-sans text-xs text-muted-foreground">· {intensity} / 5</span></p>
          <Slider className="urge-slider h-14 px-6" value={[intensity]} onValueChange={(values) => { const value = values[0]; if (value !== undefined) setIntensity(value); }} min={1} max={5} step={1} thumbLabel="Urge intensity" thumbValueText={`${intensity} — ${levels[intensity - 1]}`} />
          <div className="flex justify-between text-xs text-graphite"><span>Whispering</span><span>Very loud</span></div>
        </div>
        <p className="mb-3 mt-5 text-sm text-graphite">A feeling, if one fits <span className="text-muted-foreground">· optional</span></p>
        <div className="flex flex-wrap gap-2.5" role="group" aria-label="Optional feelings">{emotions.map((emotion) => <Button key={emotion} variant="ghost" aria-pressed={feelings.includes(emotion)} onClick={() => setFeelings((current) => current.includes(emotion) ? current.filter((value) => value !== emotion) : [...current, emotion])} className={chipClass(feelings.includes(emotion))}>{emotion}</Button>)}</div>
      </div>}

      {showingTools && <div className="my-5 grid gap-3" role="group" aria-label="Choose a soothing activity">
        {activities.map(({ id, title, detail, icon: Icon, tint, ink }) => <Button key={id} variant="ghost" aria-pressed={selectedActivity === id} onClick={() => setSelectedActivity(id)} className={`pause-choice min-h-[82px] w-full justify-start gap-3 whitespace-normal rounded-2xl border px-4 py-3 text-left ${selectedActivity === id ? "border-primary bg-card shadow-soft hover:bg-card" : "border-border bg-card/60 hover:bg-card"}`}>
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tint} ${ink}`}><Icon className="h-7 w-7" strokeWidth={1.2} /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold leading-snug text-foreground">{title}</span><span className="mt-1 block text-xs font-normal text-graphite">{detail}</span></span>
          <span className="grid h-5 w-5 shrink-0 place-items-center text-primary" aria-hidden="true">{selectedActivity === id && <Check className="h-5 w-5" />}</span>
        </Button>)}
      </div>}

      <div className="flex flex-col gap-2">
        <Button onClick={() => { if (showingTools) { close(false); onBeginActivity(selectedActivity); } else changeStep(step + 1); }} className="h-[52px] w-full rounded-full font-semibold shadow-soft hover:bg-primary-strong">{showingTools ? <Leaf className="h-4 w-4" /> : null}{showingTools ? "Begin Activity" : "Continue"}{!showingTools && <ArrowRight className="h-4 w-4" />}</Button>
        {showingTools && <Button variant="ghost" onClick={() => close(false)} className="min-h-12 w-full whitespace-normal rounded-full px-2 text-sm text-graphite">I feel better, return to Home</Button>}
        <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-1">
          {(step > 0 || toolsOnly) ? <Button variant="ghost" onClick={() => changeStep(toolsOnly ? step : step - 1)} className="h-12 rounded-full px-3 text-sm text-graphite"><ArrowLeft className="h-4 w-4" />Back</Button> : <span className="text-xs text-muted-foreground">At your own pace</span>}
          <Button variant="ghost" onClick={() => { if (showingTools) { close(false); onBeginActivity(selectedActivity); } else skipToTools(); }} className="h-12 rounded-full px-3 text-sm font-semibold text-primary-strong">Skip to tools<ArrowRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>;
}
