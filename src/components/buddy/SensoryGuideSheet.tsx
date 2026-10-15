import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getSensoryExercise } from "@/lib/sensory-guide.functions";
import type { SensoryExercise } from "@/lib/sensory-guide.server";
import type { GroundingActivity } from "@/components/buddy/GroundingSheet";

const ideas = ["Fingertips feel buzzy and restless", "I want something cool and smooth", "Hands feel tight, I need something squishy"];

export function SensoryGuideSheet({ open, onOpenChange, onOpenActivity }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenActivity: (a: Exclude<GroundingActivity, null>) => void;
}) {
  const navigate = useNavigate();
  const [feeling, setFeeling] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exercise, setExercise] = useState<SensoryExercise | null>(null);

  const ask = async () => {
    setLoading(true); setError(null); setExercise(null);
    try {
      const res = await getSensoryExercise({ data: { feeling } });
      if (res.ok) setExercise(res.exercise); else setError(res.message);
    } catch { setError("Couldn't find a suggestion just now. Try again in a little while."); }
    finally { setLoading(false); }
  };
  const openSurface = () => {
    if (!exercise) return;
    onOpenChange(false);
    if (exercise.surface === "texture-pad") navigate({ to: "/texture" });
    else if (exercise.surface === "breathing") onOpenActivity("breathing");
    else if (exercise.surface === "meadow") onOpenActivity("meadow");
  };

  return <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="bottom" className="max-h-[94dvh] overflow-y-auto rounded-t-3xl bg-background px-5 pt-14 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md">
        <SheetHeader className="px-0 text-left">
          <SheetTitle className="font-display text-2xl">What do your hands need?</SheetTitle>
          <SheetDescription className="text-graphite">Describe how your hands feel or a texture you're craving. Lovable AI will suggest a gentle exercise just for you.</SheetDescription>
        </SheetHeader>
        <Textarea value={feeling} onChange={(e) => setFeeling(e.target.value)} maxLength={500} rows={3} aria-label="How your hands feel" placeholder="e.g. My fingers feel fidgety and I want something bumpy…" className="mt-4 rounded-2xl border-border bg-card text-base" />
        <div className="mt-3 flex flex-wrap gap-2">{ideas.map((i) => <Button key={i} variant="ghost" onClick={() => setFeeling(i)} className="min-h-12 whitespace-normal rounded-2xl border border-border bg-card px-3 text-xs text-graphite hover:bg-secondary hover:text-graphite">{i}</Button>)}</div>
        <Button onClick={ask} disabled={loading || feeling.trim().length < 2} className="mt-4 h-[52px] w-full rounded-full font-semibold shadow-soft hover:bg-primary-strong"><Sparkles className="h-4 w-4" />{loading ? "Finding something gentle…" : "Suggest an exercise"}</Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">A wellness idea, not medical advice. What you write isn't saved.</p>
        {error && <p role="status" className="mt-4 rounded-2xl bg-honey-soft p-4 text-sm text-graphite">{error}</p>}
        {exercise && <article className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-soft" aria-live="polite">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary"><Leaf className="h-4 w-4" />About {exercise.minutes} min</div>
          <h3 className="mt-1 font-display text-xl text-primary-strong">{exercise.title}</h3>
          <p className="mt-2 text-sm text-graphite">{exercise.why}</p>
          <ol className="mt-4 space-y-2 text-sm text-foreground">{exercise.steps.map((s, i) => <li key={i} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs text-primary-strong">{i + 1}</span><span>{s}</span></li>)}</ol>
          {exercise.surface !== "none" && <Button variant="ghost" onClick={openSurface} className="mt-4 min-h-12 w-full rounded-full border border-primary/30 text-primary-strong hover:bg-primary-soft hover:text-primary-strong">{exercise.surface === "texture-pad" ? "Open Texture Pad" : exercise.surface === "breathing" ? "Open Box Breathing" : "Visit Healing Meadow"}<ArrowRight className="h-4 w-4" /></Button>}
        </article>}
      </div>
    </SheetContent>
  </Sheet>;
}
