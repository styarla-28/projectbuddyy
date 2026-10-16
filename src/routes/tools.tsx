import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Heart, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BottomNav } from "@/components/buddy/BottomNav";
import { useSensoryControls } from "@/components/buddy/SensoryProvider";
import { MirrorSanctuary } from "@/components/buddy/MirrorSanctuary";
import { StreamBreathing, StepsActivity, Soundscapes, WatercolorSorter, groundingSteps, oilSteps, stretchSteps } from "@/components/buddy/ToolActivities";

export const Route = createFileRoute("/tools")({
  validateSearch: (search: Record<string, unknown>): { open?: ToolId } => (TOOL_IDS.includes(search["open"] as ToolId) ? { open: search["open"] as ToolId } : {}),
  head: () => ({
    meta: [
      { title: "Coping Sanctuary · Project Buddy" },
      { name: "description", content: "Gentle practices for restless hands and busy minds: breathing, textures, hand care, and soft distractions." },
      { property: "og:title", content: "Coping Sanctuary · Project Buddy" },
      { property: "og:description", content: "Gentle practices for restless hands and busy minds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tools,
});

import { FAVORITES_KEY, filters, loadFavorites, tools, TOOL_IDS, type Cat, type Filter, type ToolId } from "@/lib/tools";

const sections: { cat: Cat; title: string }[] = [{ cat: "relief", title: "In-the-Moment Relief" }, { cat: "hands", title: "Hands & Body Care" }, { cat: "distract", title: "Distraction & Soft Focus" }];

function Tools() {
  const { sensoryQuiet } = useSensoryControls();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<ToolId | null>(null);
  const [favorites, setFavorites] = useState<ToolId[]>([]);
  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);
  const { open: requested } = Route.useSearch();
  useEffect(() => {
    if (!requested) return;
    navigate({ to: "/tools", search: {}, replace: true });
    if (requested === "texture" || requested === "wash") navigate({ to: requested === "texture" ? "/texture" : "/wash" });
    else setOpen(requested);
  }, [requested]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggleFavorite = (id: ToolId) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try { window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };
  const tool = tools.find((t) => t.id === open);
  const launch = (id: ToolId) => id === "texture" ? navigate({ to: "/texture" }) : id === "wash" ? navigate({ to: "/wash" }) : setOpen(id);
  const body: Record<Exclude<ToolId, "texture" | "wash">, ReactNode> = {
    breathing: <StreamBreathing />, grounding: <StepsActivity steps={groundingSteps} />, oil: <StepsActivity steps={oilSteps} />,
    stretch: <StepsActivity steps={stretchSteps} />, sound: <Soundscapes muted={sensoryQuiet} />, sorter: <WatercolorSorter />,
  };
  const visible = (t: (typeof tools)[number]) => filter === "all" || (filter === "favorites" ? favorites.includes(t.id) : t.cat === filter);

  return <div className={`paper-canvas min-h-dvh pb-28 ${sensoryQuiet ? "quiet" : ""}`}>
    <main className="mx-auto w-full max-w-[480px] px-5 pt-7 sm:pt-9">
      <h1 className="font-display text-[28px] leading-tight">Coping Sanctuary<span className="text-honey">.</span></h1>
      <p className="mt-1.5 text-[13px] text-graphite">Gentle practices for restless hands and busy minds</p>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter tools">{filters.map((f) => <Button key={f.id} variant="ghost" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className={`min-h-12 shrink-0 rounded-full border px-4 text-sm ${filter === f.id ? "border-primary bg-primary-soft text-primary-strong hover:bg-primary-soft hover:text-primary-strong" : "border-border bg-card text-graphite hover:bg-secondary hover:text-graphite"}`}>{f.label}</Button>)}</div>
      {sections.filter((s) => filter === "all" || filter === "favorites" || filter === s.cat).map((s) => {
        const shown = tools.filter((t) => t.cat === s.cat && visible(t));
        if (!shown.length) return null;
        return <section key={s.cat} className="mt-6" aria-labelledby={`sec-${s.cat}`}>
          <h2 id={`sec-${s.cat}`} className="mb-3 font-display text-lg">{s.title}</h2>
          <div className="grid gap-3">{shown.map(({ id, title, tag, text, icon: Icon, tint, ink }) => <div key={id} className="relative">
            <Button variant="ghost" onClick={() => launch(id)} className="grounding-card grid h-auto min-h-[88px] w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 whitespace-normal rounded-2xl border border-border bg-card px-4 py-4 pr-14 text-left shadow-soft hover:bg-card">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tint} ${ink}`}>{id === "sound" && sensoryQuiet ? <VolumeX className="size-6!" strokeWidth={1.4} /> : <Icon className="size-6!" strokeWidth={1.4} />}</span>
              <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold text-foreground">{title}</span><span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-graphite">{id === "sound" && sensoryQuiet ? "Muted in Quiet Mode" : tag}</span></span><span className="mt-1 block text-xs font-normal text-graphite">{text}</span></span>
            </Button>
            <Button variant="ghost" size="icon" type="button" aria-label={favorites.includes(id) ? `Remove ${title} from favorites` : `Save ${title} as a favorite`} aria-pressed={favorites.includes(id)} onClick={() => toggleFavorite(id)} className={`absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full transition-colors hover:bg-secondary ${favorites.includes(id) ? "text-blush" : "text-muted-foreground hover:text-graphite"}`}>
              <Heart className="size-5" strokeWidth={1.6} fill={favorites.includes(id) ? "currentColor" : "none"} />
            </Button>
          </div>)}</div>
        </section>;
      })}
      {filter === "all" && <MirrorSanctuary />}
      {filter === "favorites" && favorites.length === 0 && <p className="mt-8 rounded-3xl border border-border bg-card p-6 text-center text-sm text-graphite shadow-soft">No favorites yet. Tap the little heart on any tool you love, and it will wait for you here.</p>}
      <p className="mt-6 text-center font-display text-xs italic text-muted-foreground">Every pause is a kind one.</p>
    </main>
    <BottomNav />
    <Sheet open={!!tool} onOpenChange={(o) => { if (!o) setOpen(null); }}>
      <SheetContent side="bottom" showCloseButton={false} className={`max-h-[94dvh] overflow-y-auto rounded-t-3xl bg-background px-5 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] ${sensoryQuiet ? "quiet" : ""}`}>
        <div className="mx-auto max-w-md">
          <Button variant="ghost" onClick={() => setOpen(null)} className="h-12 rounded-full px-3 text-graphite"><ArrowLeft className="h-4 w-4" />Exit & Return to Tools</Button>
          {tool && <><SheetHeader className="mt-2 px-0 text-left"><SheetTitle className="font-display text-2xl">{tool.title}</SheetTitle><SheetDescription className="text-graphite">{tool.text}</SheetDescription></SheetHeader>{body[tool.id as Exclude<ToolId, "texture" | "wash">]}</>}
        </div>
      </SheetContent>
    </Sheet>
  </div>;
}
