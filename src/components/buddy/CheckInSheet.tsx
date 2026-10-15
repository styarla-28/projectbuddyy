import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const steps = [
  { title: "What's happening right now?", options: ["Stressed", "Bored", "Tired", "Not sure"] },
  { title: "Where are you with the urge?", options: ["Just noticing", "Getting stronger", "Already started", "Passing"] },
  { title: "What might help?", options: ["Breathing", "Something to touch", "A distraction", "Just company"] },
];

export function CheckInSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const done = !current;

  const close = (o: boolean) => {
    onOpenChange(o);
    if (!o) setTimeout(() => setStep(0), 300);
  };

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent side="bottom" className="rounded-t-3xl border-none bg-card pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-md">
          {done ? (
            <SheetHeader className="text-left">
              <SheetTitle>Thank you for pausing</SheetTitle>
              <SheetDescription>Noticing is already a kind step. Let's try a slow breath together.</SheetDescription>
              <Button onClick={() => close(false)} className="mt-4 min-h-[54px] rounded-full bg-primary px-6 font-medium text-primary-foreground">
                Okay
              </Button>
            </SheetHeader>
          ) : (
            <>
              <SheetHeader className="text-left">
                <p className="text-xs font-medium text-accent">Step {step + 1} of 3 · all optional</p>
                <SheetTitle>{current.title}</SheetTitle>
                <SheetDescription>There's no wrong answer.</SheetDescription>
              </SheetHeader>
              <div className="mt-4 grid grid-cols-2 gap-3 px-4">
                {current.options.map((o) => (
                  <Button key={o} onClick={() => setStep(step + 1)} className="min-h-14 rounded-[18px] bg-secondary px-3 text-sm font-medium transition-colors hover:bg-primary-soft">
                    {o}
                  </Button>
                ))}
              </div>
              <Button onClick={() => setStep(step + 1)} className="mx-auto mt-3 block min-h-12 px-4 text-sm text-muted-foreground underline-offset-4 hover:underline">
                Skip
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
