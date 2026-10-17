import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Camera, ShieldCheck, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSensoryControls } from "@/components/buddy/SensoryProvider";
import buddy from "@/assets/moss-buddy.png";
import { CompanionFigure } from "@/components/buddy/CompanionFigure";
import { useCompanion } from "@/lib/companion";

/** Softened, opt-in mirror. Frames stay in this tab: never recorded, stored, or sent. */
export function MirrorSanctuary() {
  const { sensoryQuiet, cameraOptIn } = useSensoryControls();
  const [companion] = useCompanion();
  const [consent, setConsent] = useState(false);
  const [live, setLive] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const exitRef = useRef<HTMLButtonElement>(null);

  const cut = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const exit = () => { cut(); setLive(false); setWelcome(true); };

  const stepInside = async () => {
    setConsent(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      setWelcome(false);
      setLive(true);
    } catch {
      toast("No problem at all. Your companion is right here with you in the meadow.");
    }
  };

  useEffect(() => {
    if (live && videoRef.current && streamRef.current) { videoRef.current.srcObject = streamRef.current; exitRef.current?.focus(); }
  }, [live]);
  useEffect(() => { if (!cameraOptIn) { cut(); setLive(false); setConsent(false); setWelcome(false); } }, [cameraOptIn]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const hide = () => { if (document.hidden && streamRef.current) exit(); };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("pagehide", cut);
    return () => { document.removeEventListener("visibilitychange", hide); window.removeEventListener("pagehide", cut); cut(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!live) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") exit(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [live]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!cameraOptIn) return null;

  return <>
    {welcome ? (
      <section role="status" className="mirror-fade mt-5 rounded-3xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-start gap-3">
          <img src={buddy} alt="" className="h-12 w-12 shrink-0 object-contain" />
          <p className="font-display text-[15px] leading-snug text-foreground">Welcome back. You took care of yourself just now. Nothing was lost.</p>
        </div>
        <Button onClick={() => setWelcome(false)} variant="outline" className="mt-3 h-12 w-full rounded-full">Rest in Meadow</Button>
      </section>
    ) : (
      <Button variant="ghost" onClick={() => setConsent(true)} className="grounding-card mt-5 h-[72px] w-full justify-start gap-4 whitespace-normal rounded-2xl border border-stream/20 bg-card/70 px-5 text-left hover:bg-stream-soft/60">
        <Camera className="h-7 w-7 shrink-0 text-stream" strokeWidth={1.4} />
        <span className="flex-1"><span className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-graphite">Mirror Sanctuary<span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">Optional</span></span><span className="mt-1 block text-[11px] font-normal text-muted-foreground">A softened reflection, companion beside you</span></span>
        <ArrowUpRight className="h-4 w-4 text-stream" />
      </Button>
    )}

    <Sheet open={consent} onOpenChange={setConsent}>
      <SheetContent side="bottom" showCloseButton={false} className={`mx-auto max-h-[94dvh] max-w-md overflow-y-auto rounded-t-2xl bg-card px-5 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] ${sensoryQuiet ? "quiet" : ""}`}>
        <SheetHeader className="px-0 text-left">
          <SheetTitle className="flex items-center gap-2 font-display text-xl"><Sparkles className="h-5 w-5 text-honey" strokeWidth={1.5} />Mirror Sanctuary<span className="rounded-full bg-secondary px-2 py-0.5 font-sans text-[11px] font-medium text-graphite">Optional</span></SheetTitle>
          <SheetDescription className="sr-only">A softened, private reflection with your companion.</SheetDescription>
        </SheetHeader>
        <div className="mx-auto my-4 grid h-20 w-20 place-items-center rounded-full border border-border bg-secondary"><Camera className="h-8 w-8 text-graphite" strokeWidth={1.4} /></div>
        <h3 className="text-center font-display text-lg">Check in gently</h3>
        <p className="mt-2 text-center text-sm text-graphite">A softened reflection with your companion beside you. Look without the pressure to inspect, fix, or pick.</p>
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-stream-soft p-3 text-xs text-graphite"><ShieldCheck className="size-4 shrink-0 text-stream" />Frames never leave your device. Video is never saved or recorded.</p>
        <div className="mt-5 grid gap-2">
          <Button onClick={stepInside} className="h-12 rounded-full bg-foreground text-background hover:bg-foreground/90">Step Inside</Button>
          <Button onClick={() => setConsent(false)} variant="outline" className="h-12 rounded-full bg-card">Stay in Meadow</Button>
        </div>
      </SheetContent>
    </Sheet>

    {live && typeof document !== "undefined" && createPortal(
      <div role="dialog" aria-modal="true" aria-label="Mirror Sanctuary" className="mirror-screen mirror-fade fixed inset-0 z-[60] bg-foreground">
        <p className="sr-only" aria-live="assertive">Entering Mirror Sanctuary. Soft focus active. Exit Safe button available at top right.</p>
        <video ref={videoRef} autoPlay playsInline muted className="mirror-soft h-full w-full -scale-x-100 object-cover" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-background opacity-15 mix-blend-multiply" />
        <div aria-hidden className="mirror-anchor pointer-events-none absolute inset-2 rounded-3xl border-2 border-honey/40" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))]">
          <span className="rounded-full bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground">Soft Focus On</span>
          <Button ref={exitRef} onClick={exit} className="h-12 min-w-12 rounded-full bg-foreground px-4 text-background hover:bg-foreground/90"><X />Exit Safe</Button>
        </div>
        <div className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 flex items-center gap-2 rounded-2xl border border-border bg-background/90 p-3 backdrop-blur">
          <CompanionFigure color={companion.color} accessory={companion.accessory} className="mirror-buddy h-12 w-12" imgClassName="object-contain" alt="Your companion" />
          <span className="font-serif text-sm text-foreground">Breathing with you</span>
        </div>
      </div>, document.body)}
  </>;
}
