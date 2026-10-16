import type { CSSProperties } from "react";
import clover from "@/assets/acc-clover.png";
import acorn from "@/assets/acc-acorn.png";
import teacup from "@/assets/acc-teacup.png";
import dewdrop from "@/assets/acc-dewdrop.png";
import scarf from "@/assets/acc-scarf.png";
import buddy from "@/assets/moss-buddy.png";
import { DEFAULT_COMPANION } from "@/lib/companion";

const mask = { maskImage: `url(${buddy})`, WebkitMaskImage: `url(${buddy})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center bottom", WebkitMaskPosition: "center bottom" } as const;

const ACCESSORY_ART: Record<string, { src: string; style: CSSProperties }> = {
  "Clover Sprout": { src: clover, style: { left: "55%", top: "12%", width: "20%", transform: "rotate(18deg)" } },
  "Acorn Cap": { src: acorn, style: { left: "37%", top: "9%", width: "26%" } },
  "Teacup Hat": { src: teacup, style: { left: "32%", top: "10%", width: "38%" } },
  "Dewdrop Pin": { src: dewdrop, style: { left: "60%", top: "56%", width: "9%", transform: "rotate(-12deg)" } },
  "Linen Scarf": { src: scarf, style: { left: "27%", top: "53%", width: "48%" } },
};

function Accessory({ name, color, tinted }: { name: string; color: string; tinted: boolean }) {
  const art = ACCESSORY_ART[name];
  if (!art) return null;
  const m = { maskImage: `url(${art.src})`, WebkitMaskImage: `url(${art.src})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" };
  return <span aria-hidden className="absolute isolate block drop-shadow-sm" style={art.style}>
    <img src={art.src} alt="" className="block h-auto w-full" />
    {tinted && <span className="absolute inset-0" style={{ ...m, background: color, mixBlendMode: "soft-light", opacity: 0.55 }} />}
  </span>;
}

/** The companion art tinted with the chosen body wash, plus the chosen accessory. Moss green shows the original painting. */
export function CompanionFigure({ color, accessory, className = "", imgClassName = "", alt = "" }: { color: string; accessory: string; className?: string; imgClassName?: string; alt?: string }) {
  const tinted = color.toLowerCase() !== DEFAULT_COMPANION.color.toLowerCase();
  return <span className={`relative isolate block ${className}`}><span className="absolute bottom-0 left-1/2 aspect-square h-full max-w-full -translate-x-1/2">
    <img src={buddy} alt={alt} width={1024} height={1024} className={`absolute inset-0 h-full w-full object-contain object-bottom ${imgClassName}`} />
    {tinted && <>
      <span aria-hidden className="absolute inset-0" style={{ ...mask, background: color, mixBlendMode: "color" }} />
      <span aria-hidden className="absolute inset-0" style={{ ...mask, background: color, mixBlendMode: "soft-light", opacity: 0.5 }} />
    </>}
    <Accessory name={accessory} color={color} tinted={tinted} />
  </span></span>;
}
