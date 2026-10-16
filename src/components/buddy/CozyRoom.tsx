import { useState } from "react";
import { Button } from "@/components/ui/button";
import sanctuary from "@/assets/buddy-sanctuary.jpg";
import { CompanionFigure } from "@/components/buddy/CompanionFigure";
import { useCompanion } from "@/lib/companion";

export function CozyRoom() {
  const [greeted, setGreeted] = useState(false);
  const [c] = useCompanion();
  const name = c.name.trim() || "Buddy";
  return <div className="sanctuary relative isolate w-full overflow-hidden rounded-[26px]">
    <img src={sanctuary} alt="A hand-painted sunlit cottage opening onto a peaceful meadow" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover" />
    <div className="sanctuary-dialogue absolute left-5 right-5 top-5 z-10 mx-auto max-w-[300px] rounded-[20px] border border-border/70 bg-card/95 px-5 py-3 text-center shadow-soft">
      <p className="font-display text-[15px] leading-relaxed">{greeted ? `A little hello from ${name}. I'm right here.` : "Hands are resting right now. Take a deep breath with me."}</p>
    </div>
    <Button variant="ghost" aria-label={`Say hi to ${name}`} onClick={() => setGreeted((g) => !g)} className="buddy-target absolute bottom-[6%] left-1/2 h-[48%] w-[45%] rounded-full p-0 hover:bg-transparent">
      <span className="buddy-settle block h-full w-full"><CompanionFigure color={c.color} accessory={c.accessory} alt={`${name}, your sleepy leafy companion`} className="buddy-rest h-full w-full" /></span>
    </Button>
    <span className="absolute bottom-3 right-4 text-[10px] font-medium text-primary-strong">a little place to just be</span>
  </div>;
}
