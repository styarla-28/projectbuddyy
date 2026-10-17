import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Lock, PenLine, Pencil, Trash2, Feather, BookOpen } from "lucide-react";
import { BottomNav } from "@/components/buddy/BottomNav";
import { MoodTracker } from "@/components/buddy/MoodTracker";
import { Button } from "@/components/ui/button";
import { dateStamp, loadEntries, saveEntries, type JournalEntry } from "@/lib/journal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reflections")({
  head: () => ({
    meta: [
      { title: "Pattern Journal · Project Buddy" },
      { name: "description", content: "Gentle, private notes for your thoughts and restless moments — stored only on your device." },
      { property: "og:title", content: "Pattern Journal · Project Buddy" },
      { property: "og:description", content: "Gentle, private notes for your thoughts and restless moments — stored only on your device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reflections,
});

const PROMPTS = ["Where were my hands resting before the urge started?", "What feeling felt heavy right before?", "What comforted my body today?"];
const TAGS = {
  body: { label: "Body Focus", options: ["Fingers & nails", "Cuticles", "Face & jaw", "Shoulders", "Other"] },
  mood: { label: "Gentle Mood", options: ["Overwhelmed", "Restless", "Peaceful", "Tired", "Bored"] },
  outcome: { label: "Urge Outcome", options: ["Paused gently", "Used tactile pad", "Showed self-compassion"] },
} as const;
type TagKey = keyof typeof TAGS;
const emptyTags = { body: [] as string[], mood: [] as string[], outcome: [] as string[] };

function Reflections() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState("");
  const [tags, setTags] = useState(emptyTags);
  const [editing, setEditing] = useState<string | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const area = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setEntries(loadEntries()); setLoaded(true); }, []);
  useEffect(() => { if (loaded) saveEntries(entries); }, [entries, loaded]);
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(192, Math.ceil(el.scrollHeight / 32) * 32)}px`;
  }, [text]);

  const toggleTag = (key: TagKey, value: string) => setTags((t) => ({ ...t, [key]: t[key].includes(value) ? t[key].filter((v) => v !== value) : [...t[key], value] }));
  const insertPrompt = (p: string) => { setText((t) => (t.trim() ? `${t.trimEnd()}\n${p}\n` : `${p}\n`)); area.current?.focus(); };
  const reset = () => { setText(""); setTags(emptyTags); setEditing(null); };
  const save = () => {
    if (!text.trim()) return;
    if (editing) setEntries((list) => list.map((e) => (e.id === editing ? { ...e, text: text.trim(), ...tags } : e)));
    else setEntries((list) => [{ id: crypto.randomUUID(), text: text.trim(), createdAt: Date.now(), ...tags }, ...list]);
    reset();
  };
  const edit = (e: JournalEntry) => { setEditing(e.id); setText(e.text); setTags({ body: e.body, mood: e.mood, outcome: e.outcome }); area.current?.scrollIntoView({ behavior: "smooth", block: "center" }); };
  const remove = (id: string) => { setEntries((list) => list.filter((e) => e.id !== id)); if (editing === id) reset(); };

  return (
    <div className="paper-canvas min-h-dvh pb-28">
      <main className="mx-auto w-full max-w-xl px-4 pt-6 sm:px-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold text-foreground">Pattern Journal</h1>
            <p className="mt-1 text-sm text-muted-foreground">Gentle notes for your thoughts and restless moments</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-graphite"><Lock className="size-3.5" />Local & Private</span>
            <Button variant="outline" className="min-h-12 rounded-full" onClick={() => { reset(); area.current?.focus(); }}><PenLine />New Note</Button>
          </div>
        </header>

        <MoodTracker />

        <section aria-label="Reflection prompts" className="mt-5 flex flex-wrap gap-2">
          {PROMPTS.filter((p) => !hidden.includes(p)).map((p) => (
            <span key={p} className="inline-flex max-w-full items-stretch overflow-hidden rounded-2xl border border-border bg-honey-soft text-sm text-foreground">
              <Button variant="ghost" type="button" onClick={() => insertPrompt(p)} className="min-h-12 px-3 py-2 font-serif text-base whitespace-normal rounded-none text-left">{p}</Button>
              <Button variant="ghost" type="button" aria-label="Dismiss prompt" onClick={() => setHidden((h) => [...h, p])} className="min-h-12 min-w-12 rounded-none border-l border-border px-2 text-muted-foreground">×</Button>
            </span>
          ))}
        </section>

        <section className="mt-4 overflow-hidden rounded-3xl border border-border shadow-soft">
          <label htmlFor="journal-draft" className="sr-only">Journal note</label>
          <textarea
            id="journal-draft" ref={area} value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Write whatever feels true right now…"
            className="journal-paper block w-full resize-none overflow-hidden border-0 pl-12 pr-4 pt-0 font-sans text-sm leading-8 text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            style={{ paddingTop: 32, paddingBottom: 32 }}
          />
        </section>

        <section aria-label="Optional tags" className="mt-5 space-y-4">
          {(Object.keys(TAGS) as TagKey[]).map((key) => (
            <fieldset key={key}>
              <legend className="text-sm font-semibold text-graphite">{TAGS[key].label} <span className="font-normal text-muted-foreground">· optional</span></legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {TAGS[key].options.map((o) => {
                  const on = tags[key].includes(o);
                  return <button key={o} type="button" aria-pressed={on} onClick={() => toggleTag(key, o)} className={cn("min-h-12 rounded-full border px-4 text-sm transition-colors", on ? "border-primary bg-primary-soft text-primary-strong" : "border-border bg-card text-graphite")}>{o}</button>;
                })}
              </div>
            </fieldset>
          ))}
        </section>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <Button variant="ghost" className="min-h-12 rounded-full" onClick={reset}>{editing ? "Cancel edit" : "Clear Draft"}</Button>
          <Button className="h-[50px] flex-1 rounded-full text-base" disabled={!text.trim()} onClick={save}><Feather />{editing ? "Update My Journal" : "Save to My Journal"}</Button>
        </div>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3" />Stored privately on your device</p>

        <section aria-label="Saved notes" className="mt-8 space-y-4">
          <h2 className="font-display text-lg font-semibold">Your notes</h2>
          {loaded && entries.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border bg-card p-6 text-center">
              <div className="mx-auto grid size-20 place-items-center rounded-full bg-honey-soft text-honey"><BookOpen className="size-10" strokeWidth={1.25} /></div>
              <p className="mx-auto mt-4 max-w-xs text-sm text-graphite">No notes yet. This space is here whenever you feel like writing down a thought.</p>
            </div>
          )}
          {entries.map((e) => (
            <article key={e.id} className="journal-entry rounded-3xl border border-border bg-card p-5 shadow-soft">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{dateStamp(e.createdAt)}</p>
              <p className="mt-2 whitespace-pre-wrap font-sans leading-7 text-foreground">{e.text}</p>
              {[...e.body, ...e.mood, ...e.outcome].length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">{[...e.body, ...e.mood, ...e.outcome].map((t) => <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-graphite">{t}</span>)}</div>
              )}
              <p className="mt-4 rounded-2xl bg-primary-soft px-4 py-3 font-serif text-base text-foreground">You showed awareness and care for yourself in this moment.</p>
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="ghost" className="min-h-12 rounded-full" onClick={() => edit(e)}><Pencil />Edit</Button>
                <Button variant="ghost" className="min-h-12 rounded-full text-graphite" onClick={() => remove(e.id)}><Trash2 />Delete note</Button>
              </div>
            </article>
          ))}
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
