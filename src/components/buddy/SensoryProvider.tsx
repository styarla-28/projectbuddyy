import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const SensoryContext = createContext({ quiet: false, reducedMotion: false, sensoryQuiet: false, toggleQuiet: () => {} });

export function SensoryProvider({ children }: { children: ReactNode }) {
  const [quiet, setQuiet] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sensoryQuiet = quiet || reducedMotion;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("quiet", sensoryQuiet);
    if (!sensoryQuiet) return;
    // No sound is currently used. Also silence any media mounted by an activity.
    const previousMuted = new Map<HTMLMediaElement, boolean>();
    const muteMedia = () => {
      document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((media) => {
        if (!previousMuted.has(media)) previousMuted.set(media, media.muted);
        media.muted = true;
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

  return <SensoryContext.Provider value={{ quiet, reducedMotion, sensoryQuiet, toggleQuiet: () => setQuiet((current) => !current) }}>{children}</SensoryContext.Provider>;
}

export const useSensoryControls = () => useContext(SensoryContext);