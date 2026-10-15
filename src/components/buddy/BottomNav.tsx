import { Link } from "@tanstack/react-router";
import { Leaf, Wind, BookOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { to: "/", label: "Home", icon: Leaf },
  { to: "/tools", label: "Tools", icon: Wind },
  { to: "/reflections", label: "Reflections", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  return <nav aria-label="Main" className="bottom-nav fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-md"><ul className="mx-auto grid max-w-[480px] grid-cols-4 px-3">{tabs.map(({ to, label, icon: Icon }) => <li key={to}><Button asChild variant="ghost" className="h-auto w-full rounded-none p-0 hover:bg-transparent"><Link to={to} activeOptions={{ exact: true }} activeProps={{ "aria-current": "page" }} className="nav-link flex min-h-[72px] flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground data-[status=active]:text-primary-strong"><span className="nav-icon grid h-8 w-12 place-items-center rounded-full"><Icon className="h-5 w-5" strokeWidth={1.5} /></span>{label}</Link></Button></li>)}</ul></nav>;
}
export function PlaceholderPage({ title, text }: { title: string; text: string }) {
  return <div className="paper-canvas min-h-dvh pb-24"><main className="mx-auto max-w-md px-5 pt-10"><h1 className="font-display text-2xl font-semibold">{title}</h1><p className="mt-2 text-muted-foreground">{text}</p></main><BottomNav /></div>;
}
