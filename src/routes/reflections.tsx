import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/buddy/BottomNav";

export const Route = createFileRoute("/reflections")({
  head: () => ({
    meta: [
      { title: "Reflections · Project Buddy" },
      { name: "description", content: "A kind, private space to notice your patterns." },
      { property: "og:title", content: "Reflections · Project Buddy" },
      { property: "og:description", content: "A kind, private space to notice your patterns." },
    ],
  }),
  component: () => <PlaceholderPage title="Reflections" text="Your private reflections will live here." />,
});
