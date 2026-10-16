import { Brush, Droplet, Eye, Hand, Palette, Sprout, Volume2, Waves } from "lucide-react";

export type Cat = "relief" | "hands" | "distract";
export type ToolId = "breathing" | "texture" | "wash" | "grounding" | "oil" | "stretch" | "sound" | "sorter";
export type Filter = Cat | "all" | "favorites";
export const FAVORITES_KEY = "pb-favorite-tools";
export const filters: { id: Filter; label: string }[] = [{ id: "all", label: "All" }, { id: "favorites", label: "Favorites" }, { id: "relief", label: "Quick Relief" }, { id: "hands", label: "Hands Care" }, { id: "distract", label: "Distract & Ground" }];
export const tools: { id: ToolId; cat: Cat; title: string; tag: string; text: string; icon: typeof Waves; tint: string; ink: string }[] = [
  { id: "breathing", cat: "relief", title: "Stream Breathing", tag: "30s · 1m · 3m", text: "Slowing heart rate and relaxing nervous tension.", icon: Waves, tint: "bg-stream-soft", ink: "text-stream" },
  { id: "texture", cat: "relief", title: "Tactile Texture Pad", tag: "Open-ended", text: "Safe sensory surface for tracing, gliding, and soft pops.", icon: Sprout, tint: "bg-honey-soft", ink: "text-honey" },
  { id: "wash", cat: "relief", title: "Watercolor Wash", tag: "Open-ended", text: "Glide fingers through soft pigment that gently fades away.", icon: Brush, tint: "bg-stream-soft", ink: "text-stream" },
  { id: "grounding", cat: "relief", title: "5-4-3-2-1 Sensory Grounding", tag: "2 min", text: "Reconnect gently with the physical room around you.", icon: Eye, tint: "bg-primary-soft", ink: "text-primary" },
  { id: "oil", cat: "hands", title: "Warm Oil & Lotion Ritual", tag: "Self-care guide", text: "Gentle circular touch with moisturizer or cuticle balm.", icon: Droplet, tint: "bg-blush-soft", ink: "text-blush" },
  { id: "stretch", cat: "hands", title: "Fingers & Wrist Stretches", tag: "1 min", text: "Release clawed tension in fingers, palms, and forearms.", icon: Hand, tint: "bg-primary-soft", ink: "text-primary" },
  { id: "sound", cat: "distract", title: "Cozy River Soundscapes", tag: "Rain · Stream · Chimes", text: "Soft loops to settle a busy mind.", icon: Volume2, tint: "bg-stream-soft", ink: "text-stream" },
  { id: "sorter", cat: "distract", title: "Gentle Watercolor Sorter", tag: "No timer", text: "Arrange soft watercolor tiles in harmony.", icon: Palette, tint: "bg-honey-soft", ink: "text-honey" },
];

export const TOOL_IDS = tools.map((t) => t.id);
export function loadFavorites(): ToolId[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((id): id is ToolId => TOOL_IDS.includes(id as ToolId)) : [];
  } catch { return []; }
}
