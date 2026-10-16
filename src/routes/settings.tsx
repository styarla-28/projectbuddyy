import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Download, ExternalLink, HeartHandshake, MessageCircle, ShieldCheck, SlidersHorizontal, Sparkles, Trash2, Check } from "lucide-react";
import { BottomNav } from "@/components/buddy/BottomNav";
import { useSensoryControls } from "@/components/buddy/SensoryProvider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { JOURNAL_KEY, loadEntries } from "@/lib/journal";
import { downloadBlob, journalToText } from "@/lib/journal-export";
import { ACCESSORIES, WASHES, useCompanion, washName } from "@/lib/companion";
import buddy from "@/assets/moss-buddy.png";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Privacy · Project Buddy" },
      { name: "description", content: "Personalize your companion, tune sensory comfort, manage camera privacy and find gentle support." },
      { property: "og:title", content: "Settings & Privacy · Project Buddy" },
      { property: "og:description", content: "Personalize your companion, tune sensory comfort, manage camera privacy and find gentle support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function Group({ value, icon, title, extra, children }: { value: string; icon: ReactNode; title: string; extra?: ReactNode; children: ReactNode }) {
  return (
    <AccordionItem value={value} className="settings-group mt-4 rounded-3xl border bg-card px-4 shadow-soft last:border-b">
      <AccordionTrigger className="min-h-14 gap-3 py-3 font-display text-lg font-semibold hover:no-underline">
        <span className="flex flex-1 items-center gap-3 text-left">{icon}<span className="flex-1">{title}</span>{extra}</span>
      </AccordionTrigger>
      <AccordionContent className="pb-4">{children}</AccordionContent>
    </AccordionItem>
  );
}

function ToggleRow({ id, label, text, checked, onChange }: { id: string; label: string; text: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <div className="flex items-center gap-4 rounded-2xl py-3"><div className="min-w-0 flex-1"><label htmlFor={id} className="font-semibold">{label}</label><p id={`${id}-d`} className="mt-0.5 text-sm text-graphite">{text}</p></div><Switch id={id} aria-label={label} aria-describedby={`${id}-d`} checked={checked} onCheckedChange={onChange} className="data-[state=checked]:bg-primary" /></div>;
}

function Avatar({ color, size = 40 }: { color: string; size?: number }) {
  return <span aria-hidden className="relative grid shrink-0 place-items-center overflow-hidden rounded-full border" style={{ width: size, height: size, background: `color-mix(in oklab, ${color} 45%, var(--card))` }}><img src={buddy} alt="" className="animate-breathe w-[85%]" style={{ transformOrigin: "bottom center" }} /></span>;
}

function SettingsPage() {
  const s = useSensoryControls();
  const [companion, setCompanion] = useCompanion();
  const [note, setNote] = useState("");
  const custom = !WASHES.some((w) => w.hex.toLowerCase() === companion.color.toLowerCase());

  const exportJournal = (kind: "json" | "txt") => {
    const entries = loadEntries();
    const blob = kind === "json" ? new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" }) : new Blob([journalToText(entries)], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `project-buddy-journal.${kind}`);
    setNote(entries.length ? `Downloaded ${entries.length} reflection${entries.length === 1 ? "" : "s"}.` : "Your journal is empty, so the file has no notes yet.");
  };
  const clearAll = () => {
    try { localStorage.removeItem(JOURNAL_KEY); } catch { /* ignore */ }
    setNote("Your journal entries have been cleared from this device.");
  };

  return (
    <div className="paper-canvas min-h-dvh pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <main className="mx-auto w-full max-w-xl px-5 pt-[max(2rem,env(safe-area-inset-top))]">
        <h1 className="font-display text-3xl font-semibold">Settings & Privacy</h1>
        <p className="mt-1 text-graphite">Make this space feel like yours.</p>
        {note && <p role="status" className="mt-5 rounded-2xl bg-primary-soft p-3 text-sm text-primary-strong">{note}</p>}

        <Accordion type="multiple" defaultValue={["companion"]}>
          <Group value="companion" icon={<Sparkles className="size-5 text-honey" />} title="Companion & Personalization" extra={<Avatar color={companion.color} />}>
            <label htmlFor="companion-name" className="font-semibold">Companion Name</label>
            <input id="companion-name" value={companion.name} maxLength={24} placeholder="Name your buddy..." onChange={(e) => setCompanion({ name: e.target.value })} className="mt-2 h-12 w-full rounded-2xl border bg-background px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring" />

            <p className="mt-5 font-semibold">Body Wash Palette <span className="font-normal text-graphite">· {washName(companion.color)}</span></p>
            <div role="radiogroup" aria-label="Body wash palette" className="mt-2 flex flex-wrap gap-3">
              {WASHES.map((w) => {
                const on = w.hex.toLowerCase() === companion.color.toLowerCase();
                return <button key={w.hex} type="button" role="radio" aria-checked={on} aria-label={w.name} onClick={() => setCompanion({ color: w.hex })} className="swatch grid size-11 place-items-center rounded-full border-2" style={{ background: w.hex, borderColor: on ? "var(--foreground)" : "var(--border)" }}>{on && <Check className="size-4 text-card mix-blend-difference" />}</button>;
              })}
              <label className="swatch relative grid size-11 cursor-pointer place-items-center overflow-hidden rounded-full border-2 border-dashed" style={{ borderColor: custom ? "var(--foreground)" : "var(--border)", background: custom ? companion.color : undefined }}>
                <span className="sr-only">Custom color</span>
                {!custom && <span aria-hidden className="text-lg text-graphite">+</span>}
                <input type="color" value={companion.color} onChange={(e) => setCompanion({ color: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" />
              </label>
            </div>

            <p className="mt-5 font-semibold">Cozy Accessories</p>
            <div role="radiogroup" aria-label="Cozy accessories" className="mt-2 flex flex-wrap gap-2">
              {ACCESSORIES.map((a) => {
                const on = companion.accessory === a;
                return <button key={a} type="button" role="radio" aria-checked={on} onClick={() => setCompanion({ accessory: a })} className={`min-h-11 rounded-full border px-4 text-sm transition-colors ${on ? "border-2 border-foreground bg-honey-soft font-semibold" : "bg-background"}`}>{a}</button>;
              })}
            </div>
          </Group>

          <Group value="sensory" icon={<SlidersHorizontal className="size-5 text-primary" />} title="Sensory Comfort">
            <ToggleRow id="quiet" label="Quiet Mode" text="Mutes ambient chimes and pauses looping animations." checked={s.quiet} onChange={() => s.toggleQuiet()} />
            <ToggleRow id="motion" label="Reduced Motion" text={`Disables breathing expansions and fluid canvas effects, using static watercolor poses and simple fades.${s.systemReducedMotion ? " Your device asks for this; you can override it here." : ""}`} checked={s.reducedMotion} onChange={s.setReducedMotion} />
            <ToggleRow id="haptics" label="Gentle Haptics" text="Soft vibration feedback on taps and the texture pad (where supported)." checked={s.haptics} onChange={s.setHaptics} />
          </Group>

          <Group value="privacy" icon={<ShieldCheck className="size-5 text-stream" />} title="Camera & Local Privacy">
            <ToggleRow id="camera" label="Allow Mirror Sanctuary" text="Shows the Mirror Sanctuary on Home and Tools. Turning this off hides it and closes the camera at once." checked={s.cameraOptIn} onChange={s.setCameraOptIn} />
            <p className="flex gap-3 rounded-2xl bg-stream-soft p-4 text-sm"><ShieldCheck className="size-5 shrink-0 text-stream" />Frames never leave your device. Video is never saved, uploaded, or analyzed.</p>
            <p className="mt-5 font-semibold">Export Journal</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Button onClick={() => exportJournal("txt")} className="h-12 rounded-full bg-honey text-foreground hover:bg-honey/90"><Download />Plain text</Button>
              <Button onClick={() => exportJournal("json")} variant="outline" className="h-12 rounded-full border-honey"><Download />JSON file</Button>
            </div>
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" className="mt-3 h-12 w-full rounded-full"><Trash2 />Clear Journal Data</Button></SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl">
                <SheetHeader><SheetTitle className="font-display">Clear journal entries?</SheetTitle><SheetDescription>This cannot be undone. Your meadow flowers, moods and favorites stay.</SheetDescription></SheetHeader>
                <div className="grid gap-2 p-4 sm:grid-cols-2">
                  <SheetClose asChild><Button variant="outline" className="h-12 rounded-full">Keep my notes</Button></SheetClose>
                  <SheetClose asChild><Button onClick={clearAll} className="h-12 rounded-full bg-graphite text-card hover:bg-graphite/90">Yes, clear them</Button></SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </Group>

          <Group value="support" icon={<HeartHandshake className="size-5 text-blush" />} title="Support & Philosophy">
            <Accordion type="single" collapsible>
              <AccordionItem value="philosophy" className="border-b-0">
                <AccordionTrigger className="min-h-12 font-semibold hover:no-underline">Our Philosophy</AccordionTrigger>
                <AccordionContent className="text-graphite">Healing from skin picking and other BFRBs isn't a straight line. There are no streaks to break, no scores, and no shame here — every pause, every noticing, every gentle moment counts. You are welcome back exactly as you are, any time.</AccordionContent>
              </AccordionItem>
            </Accordion>
            <p className="mt-2 font-semibold">BFRB Support Links</p>
            <ul className="mt-2 grid gap-2">
              <li><a href="https://www.bfrb.org" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-2xl bg-secondary px-4 text-sm hover:underline"><ExternalLink className="size-4 text-stream" />TLC Foundation for BFRBs (bfrb.org)</a></li>
              <li><a href="sms:741741?&body=HOME" className="flex min-h-12 items-center gap-3 rounded-2xl bg-secondary px-4 text-sm hover:underline"><MessageCircle className="size-4 text-stream" />Crisis Text Line — text HOME to 741741</a></li>
            </ul>
          </Group>
        </Accordion>
      </main>
      <BottomNav />
    </div>
  );
}
