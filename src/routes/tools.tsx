import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/buddy/BottomNav";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Coping Tools · Project Buddy" },
      { name: "description", content: "Gentle coping tools for moments with urges." },
      { property: "og:title", content: "Coping Tools · Project Buddy" },
      { property: "og:description", content: "Gentle coping tools for moments with urges." },
    ],
  }),
  component: () => <PlaceholderPage title="Tools" text="Calming tools are coming soon." />,
});
