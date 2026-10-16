import { useEffect, useState } from "react";

export const COMPANION_KEY = "companionConfig";
export const WASHES = [
  { name: "Moss Green", hex: "#5E7A5A" },
  { name: "Stream Blue", hex: "#5C96A6" },
  { name: "Meadow Ochre", hex: "#D9A84E" },
  { name: "Blush Terracotta", hex: "#C67D78" },
  { name: "Warm Butter", hex: "#F4E29C" },
  { name: "Charcoal Ink", hex: "#3B3A36" },
] as const;
export const ACCESSORIES = ["None (Natural)", "Clover Sprout", "Acorn Cap", "Linen Scarf", "Dewdrop Pin", "Teacup Hat"] as const;

export type CompanionConfig = { name: string; color: string; accessory: string };
export const DEFAULT_COMPANION: CompanionConfig = { name: "Buddy", color: "#5E7A5A", accessory: "None (Natural)" };

export function loadCompanion(): CompanionConfig {
  try {
    const s = JSON.parse(localStorage.getItem(COMPANION_KEY) ?? "{}");
    return {
      name: typeof s.name === "string" ? s.name : DEFAULT_COMPANION.name,
      color: typeof s.color === "string" && /^#[0-9a-f]{6}$/i.test(s.color) ? s.color : DEFAULT_COMPANION.color,
      accessory: ACCESSORIES.includes(s.accessory) ? s.accessory : DEFAULT_COMPANION.accessory,
    };
  } catch { return DEFAULT_COMPANION; }
}

export function washName(hex: string) {
  return WASHES.find((w) => w.hex.toLowerCase() === hex.toLowerCase())?.name ?? "Custom wash";
}

export function useCompanion() {
  const [config, setConfig] = useState<CompanionConfig>(DEFAULT_COMPANION);
  useEffect(() => setConfig(loadCompanion()), []);
  const update = (patch: Partial<CompanionConfig>) => setConfig((c) => {
    const next = { ...c, ...patch };
    try { localStorage.setItem(COMPANION_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    return next;
  });
  return [config, update] as const;
}
