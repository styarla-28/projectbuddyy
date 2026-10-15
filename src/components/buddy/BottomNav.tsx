import { Link } from "@tanstack/react-router";
import { Home, Wrench, BookHeart, Settings } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/tools", label: "Tools", icon: Wrench },
  { to: "/reflections", label: "Reflections", icon: BookHeart },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: true }}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
              activeProps={{ "aria-current": "page" }}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PlaceholderPage({ title, text }: { title: string; text: string }) {
  return (
    <div className="min-h-dvh bg-background pb-24" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <main className="mx-auto max-w-md px-5 pt-10">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-muted-foreground">{text}</p>
      </main>
      <BottomNav />
    </div>
  );
}
