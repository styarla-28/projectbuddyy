import { Clover, Coffee, Droplet, Nut } from "lucide-react";
import buddy from "@/assets/moss-buddy.png";
import { DEFAULT_COMPANION } from "@/lib/companion";

const mask = { maskImage: `url(${buddy})`, WebkitMaskImage: `url(${buddy})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center bottom", WebkitMaskPosition: "center bottom" } as const;

function Accessory({ name }: { name: string }) {
  const icon = "absolute drop-shadow-sm";
  switch (name) {
    case "Clover Sprout": return <Clover aria-hidden className={`${icon} left-[56%] top-[6%] size-[22%] fill-primary/70 text-primary-strong`} strokeWidth={1.5} />;
    case "Acorn Cap": return <Nut aria-hidden className={`${icon} left-[34%] top-[16%] size-[32%] fill-honey text-graphite`} strokeWidth={1.5} />;
    case "Teacup Hat": return <Coffee aria-hidden className={`${icon} left-[33%] top-[12%] size-[34%] fill-card text-graphite`} strokeWidth={1.5} />;
    case "Dewdrop Pin": return <Droplet aria-hidden className={`${icon} left-[58%] top-[52%] size-[16%] fill-stream-soft text-stream`} strokeWidth={1.75} />;
    case "Linen Scarf": return <span aria-hidden className="absolute left-[27%] top-[58%] h-[9%] w-[46%] rounded-full border border-graphite/40 bg-honey-soft shadow-sm" />;
    default: return null;
  }
}

/** The companion art tinted with the chosen body wash, plus the chosen accessory. Moss green shows the original painting. */
export function CompanionFigure({ color, accessory, className = "", imgClassName = "", alt = "" }: { color: string; accessory: string; className?: string; imgClassName?: string; alt?: string }) {
  const tinted = color.toLowerCase() !== DEFAULT_COMPANION.color.toLowerCase();
  return <span className={`relative isolate block ${className}`}>
    <img src={buddy} alt={alt} width={1024} height={1024} className={`absolute inset-0 h-full w-full object-contain object-bottom ${imgClassName}`} />
    {tinted && <>
      <span aria-hidden className="absolute inset-0" style={{ ...mask, background: color, mixBlendMode: "color" }} />
      <span aria-hidden className="absolute inset-0" style={{ ...mask, background: color, mixBlendMode: "soft-light", opacity: 0.5 }} />
    </>}
    <Accessory name={accessory} />
  </span>;
}
