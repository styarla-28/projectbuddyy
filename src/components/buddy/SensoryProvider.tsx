import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const SETTINGS_KEY = "pb-settings";
type Stored = { quiet?: boolean; motion?: boolean | null; haptics?: boolean; camera?: boolean };

type Ctx = {
  quiet: boolean; reducedMotion: boolean; systemReducedMotion: boolean; sensoryQuiet: boolean; toggleQuiet: () => void;
  setReducedMotion: (on: boolean) => void; haptics: boolean; setHaptics: (on: boolean) => void;
  cameraOptIn: boolean; setCameraOptIn: (on: boolean) => void;
};
const noop = () => {};
const SensoryContext = createContext<Ctx>({ quiet: false, reducedMotion: false, systemReducedMotion: false, sensoryQuiet: false, toggleQuiet: noop, setReducedMotion: noop, haptics: false, setHaptics: noop, cameraOptIn: false, setCameraOptIn: noop });

export function SensoryProvider({ children }: { children: ReactNode }) {
  const [quiet, setQuiet] = useState(false);
  const [systemReducedMotion, setSystem] = useState(false);
  const [motion, setMotion] = useState<boolean | null>(null); // null = follow system
  const [haptics, setHaptics] = useState(false);
  const [cameraOptIn, setCameraOptIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const reducedMotion = motion ?? systemReducedMotion;
  const sensoryQuiet = quiet || reducedMotion;

  useEffect(() => {
    try {
      const s: Stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}");
      if (typeof s.quiet === "boolean") setQuiet(s.quiet);
      if (typeof s.motion === "boolean") setMotion(s.motion);
      if (typeof s.haptics === "boolean") setHaptics(s.haptics);
      if (typeof s.camera === "boolean") setCameraOptIn(s.camera);
    } catch { /* ignore */ }
    setLoaded(true);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystem(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ quiet, motion, haptics, camera: cameraOptIn })); } catch { /* ignore */ }
  }, [loaded, quiet, motion, haptics, cameraOptIn]);

  useEffect(() => {
    document.body.classList.toggle("quiet", sensoryQuiet);
    if (!sensoryQuiet) return;
    const previousMuted = new Map<HTMLMediaElement, boolean>();
    const muteMedia = () => {
      document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((media) => {
        if (!previousMuted.has(media)) previousMuted.set(media, media.muted);
        if (!media.muted) media.muted = true;
      });
    };
    muteMedia();
    const observer = new MutationObserver(muteMedia);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("volumechange", muteMedia, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("volumechange", muteMedia, true);
      previousMuted.forEach((muted, media) => { media.muted = muted; });
      document.body.classList.remove("quiet");
    };
  }, [sensoryQuiet]);

  return <SensoryContext.Provider value={{ quiet, reducedMotion, systemReducedMotion, sensoryQuiet, toggleQuiet: () => setQuiet((c) => !c), setReducedMotion: (on) => setMotion(on === systemReducedMotion ? null : on), haptics, setHaptics, cameraOptIn, setCameraOptIn }}>{children}</SensoryContext.Provider>;
}

export const useSensoryControls = () => useContext(SensoryContext);
