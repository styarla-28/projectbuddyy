import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ChevronDown, Download, FolderLock, Heart, LifeBuoy, ShieldCheck, Trash2 } from "lucide-react";
import { BottomNav } from "@/components/buddy/BottomNav";
import { useSensoryControls } from "@/components/buddy/SensoryProvider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { JOURNAL_KEY, loadEntries } from "@/lib/journal";
import { downloadBlob, journalToCsv } from "@/lib/journal-export";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Sanctuary · Project Buddy" },
      { name: "description", content: "Sensory comfort, camera privacy, local journal storage and support resources." },
      { property: "og:title", content: "Settings & Sanctuary · Project Buddy" },
      { property: "og:description", content: "Sensory comfort, camera privacy, local journal storage and support resources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-7"><h2 className="font-display text-lg font-semibold">{title}</h2><div className="mt-3 rounded-3xl border border-border bg-card p-2 shadow-soft">{children}</div></section>;
}

function ToggleRow({ id, label, text, checked, onChange }: { id: string; label: string; text: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <div className="flex items-center gap-4 rounded-2xl p-3"><div className="min-w-0 flex-1"><label htmlFor={id} className="font-semibold">{label}</label><p className="mt-0.5 text-sm text-graphite">{text}</p></div><Switch id={id} checked={checked} onCheckedChange={onChange} className="data-[state=checked]:bg-primary" /></div>;
}

function SettingsPage() {
  const s = useSensoryControls();
  const [note, setNote] = useState("");

  const exportJournal = (kind: "json" | "csv") => {
    const entries = loadEntries();
    const blob = kind === "json" ? new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" }) : new Blob([journalToCsv(entries)], { type: "text/csv;charset=utf-8" });
    downloadBlob(blob, `project-buddy-journal.${kind}`);
    setNote(entries.length ? `Downloaded ${entries.length} reflection${entries.length === 1 ? "" : "s"}.` : "Your journal is empty, so the file has no notes yet.");
  };

  const revokeCamera = () => {
    s.setCameraOptIn(false);
    setNote("Camera turned off in Project Buddy. To fully reset the browser permission, tap the lock icon beside the address bar and choose Reset permissions.");
  };

  const clearAll = () => {
    try { localStorage.removeItem(JOURNAL_KEY); } catch { /* ignore */ }
    setNote("Your reflections have been cleared from this device.");
  };

  return (
    <div className="paper-canvas min-h-dvh pb-28">
      <main className="mx-auto w-full max-w-xl px-5 pt-8">
        <span className="inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-xs text-graphite">Project Buddy v1.0 (Mobile Web/PWA)</span>
        <h1 className="mt-3 font-display text-3xl font-semibold">Settings & Sanctuary</h1>
        <p className="mt-1 text-graphite">Your sensory comfort, data privacy, and preferences</p>

        {note && <p role="status" className="mt-5 rounded-2xl bg-primary-soft p-3 text-sm text-primary-strong">{note}</p>}

        <Section title="Sensory comfort & accessibility">
          <ToggleRow id="quiet" label="Quiet Mode" text="Mutes all ambient audio, nature loops, and sound effects instantly." checked={s.quiet} onChange={() => s.toggleQuiet()} />
          <ToggleRow id="motion" label="Reduced Motion" text={`Freezes companion breathing animations and replaces sliding transitions with gentle opacity fades.${s.systemReducedMotion ? " Your device asks for reduced motion; you can override it here." : ""}`} checked={s.reducedMotion} onChange={s.setReducedMotion} />
          <ToggleRow id="haptics" label="Tactile Haptics" text="Vibrations on button taps and tactile pad interactions (where supported)." checked={s.haptics} onChange={s.setHaptics} />
        </Section>

        <Section title="Camera & AR privacy">
          <div className="flex gap-3 rounded-2xl bg-stream-soft p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-stream" />
            <p className="text-sm"><strong>100% On-Device Privacy:</strong> Project Buddy never records, stores, or transmits your camera footage or images. Any future hand-tracking runs strictly in real-time in your device browser.</p>
          </div>
          <ToggleRow id="camera" label="Camera Feature Opt-In" text="Allow experimental non-diagnostic mirror/AR view on Home screen." checked={s.cameraOptIn} onChange={s.setCameraOptIn} />
          <div className="p-3"><Button variant="outline" onClick={revokeCamera} className="h-12 w-full rounded-full">Revoke Camera Access</Button></div>
        </Section>

        <Section title="Data & reflection storage">
          <div className="flex items-center gap-2 p-3 text-sm"><FolderLock className="size-5 shrink-0 text-stream" /><span className="rounded-full bg-stream-soft px-3 py-1">Stored Privately on Your Device (localStorage)</span></div>
          <div className="grid gap-2 p-3 sm:grid-cols-2">
            <Button onClick={() => exportJournal("json")} className="h-12 rounded-full bg-honey text-foreground hover:bg-honey/90"><Download />Export My Journal (JSON)</Button>
            <Button onClick={() => exportJournal("csv")} variant="outline" className="h-12 rounded-full border-honey"><Download />Export as CSV</Button>
          </div>
          <div className="p-3 pt-0">
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="outline" className="h-12 w-full rounded-full border-blush text-blush hover:bg-blush-soft hover:text-blush"><Trash2 />Clear All Reflections & History</Button></AlertDialogTrigger>
              <AlertDialogContent className="w-[calc(100%-2rem)] rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">Clear your reflections?</AlertDialogTitle>
                  <AlertDialogDescription>This will erase your saved journal entries on this phone. Are you sure?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="h-12 rounded-full">Keep my notes</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAll} className="h-12 rounded-full bg-blush text-card hover:bg-blush/90">Yes, clear them</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Section>

        <Section title="Self-compassion & support">
          <Collapsible>
            <CollapsibleTrigger className="group flex min-h-12 w-full items-center gap-3 rounded-2xl p-3 text-left font-semibold"><Heart className="size-5 text-blush" /><span className="flex-1">The Project Buddy Philosophy</span><ChevronDown className="size-5 transition-transform group-data-[state=open]:rotate-180" /></CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3 text-graphite">Healing from dermatillomania is non-linear. There are no broken streaks, no failing grades, and no judgment here.</CollapsibleContent>
          </Collapsible>
          <div className="p-3">
            <p className="flex items-center gap-2 font-semibold"><LifeBuoy className="size-5 text-stream" />Crisis & Mental Health Support</p>
            <ul className="mt-2 grid gap-2">
              <li><a href="https://www.bfrb.org" target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center rounded-2xl bg-secondary px-4 text-sm underline-offset-2 hover:underline">TLC Foundation for Body-Focused Repetitive Behaviors (bfrb.org)</a></li>
              <li><a href="tel:988" className="flex min-h-12 items-center rounded-2xl bg-secondary px-4 text-sm hover:underline">988 Suicide & Crisis Lifeline — call or text 988</a></li>
              <li><a href="sms:741741?&body=HOME" className="flex min-h-12 items-center rounded-2xl bg-secondary px-4 text-sm hover:underline">Crisis Text Line — text HOME to 741741</a></li>
            </ul>
          </div>
        </Section>
      </main>
      <BottomNav />
    </div>
  );
}
