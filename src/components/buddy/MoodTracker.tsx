import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSun, Flower2, Leaf, Lock, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MOODS,
  MOOD_CONTEXTS,
  addMood,
  averageMood,
  loadMoods,
  moodLabel,
  recentMoods,
  saveMoods,
  type MoodEntry,
} from "@/lib/mood";

const MOOD_ICONS: Record<number, LucideIcon> = { 1: CloudRain, 2: Cloud, 3: Leaf, 4: CloudSun, 5: Flower2 };
const moodIcon = (value: number) => MOOD_ICONS[value] ?? Leaf;
import { dateStamp } from "@/lib/journal";
import { cn } from "@/lib/utils";

export function MoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [context, setContext] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => { setEntries(loadMoods()); setLoaded(true); }, []);
  useEffect(() => { if (loaded) saveMoods(entries); }, [entries, loaded]);

  const save = () => {
    if (picked === null) return;
    setEntries((list) => addMood(list, picked, context));
    setPicked(null);
    setContext(null);
    setJustSaved(true);
  };

  const recent = recentMoods(entries);
  const average = averageMood(recent);

  return (
    <section aria-label="Mood tracker" className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-semibold">How do you feel right now?</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">A gentle check-in — watch how your care sessions ripple into your days.</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-graphite"><Lock className="size-3.5" />On this device</span>
      </div>

      <div role="radiogroup" aria-label="Your mood" className="mt-4 grid grid-cols-5 gap-2">
        {MOODS.map((m) => {
          const on = picked === m.value;
          const Icon = moodIcon(m.value);
          return (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setPicked(m.value)}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl border px-1 py-2 transition-colors",
                on ? "border-primary bg-primary-soft text-primary-strong" : "border-border bg-background text-graphite",
              )}
            >
              <Icon aria-hidden className="size-5" strokeWidth={1.75} />
              <span className="text-[11px] font-medium leading-tight">{m.label}</span>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="journal-fade mt-4">
          <p className="text-sm font-semibold text-graphite">Did a moment of care come before this? <span className="font-normal text-muted-foreground">· optional</span></p>
          <div className="mt-2 flex flex-wrap gap-2">
            {MOOD_CONTEXTS.map((c) => {
              const on = context === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setContext(on ? null : c)}
                  className={cn("min-h-12 rounded-full border px-4 text-sm transition-colors", on ? "border-stream bg-stream-soft text-foreground" : "border-border bg-background text-graphite")}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <Button className="mt-4 h-[50px] w-full rounded-full text-base" onClick={save}><Flower2 />Save this feeling</Button>
        </div>
      )}
      {justSaved && picked === null && (
        <p className="journal-fade mt-4 rounded-2xl bg-honey-soft px-4 py-3 text-sm text-foreground"><Sparkles className="mr-1.5 inline size-4 text-honey" />Noted with care. Every feeling is welcome here.</p>
      )}

      <div className="mt-6 border-t border-border pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-graphite">Your last two weeks</h3>
          {average !== null && <p className="text-xs text-muted-foreground">Mostly around “{moodLabel(Math.round(average))}” lately</p>}
        </div>
        {loaded && recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No check-ins yet. When you save a feeling, it will bloom here.</p>
        ) : (
          <>
            <ol aria-label="Mood history" className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-4">
              {recent.map((e) => {
                const Icon = moodIcon(e.value);
                return (
                <li key={e.id} className="flex w-10 flex-col items-center gap-1.5" title={`${moodLabel(e.value)} · ${dateStamp(e.createdAt)}${e.context ? ` · ${e.context}` : ""}`}>
                  <Icon aria-hidden className="journal-fade text-primary-strong" strokeWidth={1.75} style={{ width: 14 + e.value * 3, height: 14 + e.value * 3 }} />
                  <span className="h-1.5 w-full rounded-full bg-secondary">
                    <span className={cn("block h-full rounded-full", e.value >= 4 ? "bg-primary" : e.value === 3 ? "bg-honey" : "bg-blush")} style={{ width: `${e.value * 20}%` }} />
                  </span>
                  <span className="text-[10px] text-muted-foreground">{new Date(e.createdAt).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}</span>
                </li>
                );
              })}
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">Feelings ebb and flow like weather — there is no score to keep, only noticing.</p>
          </>
        )}
      </div>
    </section>
  );
}
