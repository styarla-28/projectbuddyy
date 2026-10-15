import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/buddy/BottomNav";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Project Buddy" },
      { name: "description", content: "Adjust motion, sound and privacy preferences." },
      { property: "og:title", content: "Settings · Project Buddy" },
      { property: "og:description", content: "Adjust motion, sound and privacy preferences." },
    ],
  }),
  component: () => <PlaceholderPage title="Settings" text="Preferences are coming soon." />,
});
