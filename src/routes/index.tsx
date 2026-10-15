import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Volume2, VolumeX, Camera, Sparkles, Lock, Moon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CozyRoom } from "@/components/buddy/CozyRoom";
import { CheckInSheet } from "@/components/buddy/CheckInSheet";
import { BottomNav } from "@/components/buddy/BottomNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Buddy · Your calm companion" },
      { name: "description", content: "A gentle home base to pause whenever a skin-picking urge arises." },
      { property: "og:title", content: "Project Buddy · Your calm companion" },
      { property: "og:description", content: "A gentle home base to pause whenever a skin-picking urge arises." },
    ],
  }),
  component: Home,
});

function Home() {
  const [quiet, setQuiet] = useState(false);
  const [showCard, setShowCard] = useState(true);
  const [checkIn, setCheckIn] = useState(false);

  return (
    <TooltipProvider delayDuration={200}>
      <div className={`min-h-dvh bg-background pb-24 ${quiet ? "quiet" : ""}`} style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <main className="mx-auto flex max-w-md flex-col px-4">
          {/* Top bar */}
          <header className="flex items-center justify-between gap-2 py-3">
            <span className="inline-flex min-w-0 items-center gap-1.5 truncate rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {quiet ? <Moon className="h-3.5 w-3.5 shrink-0" aria-hidden /> : <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />}
              {quiet ? "Quiet mode active" : "Private session"}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button aria-label="AR Camera (optional)" className="grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:bg-secondary">
                    <Camera className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[220px]">AR Camera is optional and never diagnoses. Nothing is recorded.</TooltipContent>
              </Tooltip>
              <button
                onClick={() => setQuiet((q) => !q)}
                aria-pressed={quiet}
                aria-label={quiet ? "Turn quiet mode off" : "Turn quiet mode on"}
                className="grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:bg-secondary aria-pressed:bg-accent-soft aria-pressed:text-accent"
              >
                {quiet ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </div>
          </header>

          {/* Companion viewport */}
          <section className="relative overflow-hidden rounded-[18px] bg-card shadow-soft">
            <div className="aspect-[36/26] w-full">
              <CozyRoom />
            </div>
            {showCard && (
              <div className="absolute inset-x-3 top-3 flex items-start gap-2 rounded-[18px] bg-card/95 p-3 pl-4 shadow-soft">
                <p className="flex-1 pt-1.5 text-sm leading-snug">I'm here with you. Take a breath with me.</p>
                <button onClick={() => setShowCard(false)} className="min-h-11 shrink-0 rounded-full px-3 text-xs text-muted-foreground hover:bg-secondary">
                  Dismiss quietly
                </button>
              </div>
            )}
          </section>
          <p className="mt-2 text-center text-xs text-muted-foreground">Tap your buddy to say hi</p>

          {/* Quick action dock */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => setCheckIn(true)}
              className="animate-breathe h-[52px] w-full rounded-full bg-primary text-base font-semibold text-primary-foreground"
            >
              Pause for a moment
            </button>
            <button className="flex min-h-14 items-center gap-3 rounded-[18px] bg-accent-soft px-4 text-left hover:bg-accent-soft/70">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card text-accent">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-sm font-medium">Visit Healing Zone</span>
            </button>
          </div>
        </main>
        <BottomNav />
        <CheckInSheet open={checkIn} onOpenChange={setCheckIn} />
      </div>
    </TooltipProvider>
  );
}
