import { NavLink } from "react-router-dom";
import { LayoutGrid, FilePlus2, History, UserCircle2, Terminal } from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/submit", label: "New review", icon: FilePlus2 },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col border-r border-border bg-surface/60 shrink-0">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
          <Terminal size={18} />
        </div>
        <div className="font-display font-semibold text-sm leading-tight">
          Code Review
          <div className="text-ink-faint text-[11px] font-mono font-normal">assistant</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-ink-muted hover:bg-surface-hover hover:text-ink-primary"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-border text-[11px] text-ink-faint font-mono">
        v1.0.0 · pylint + openrouter
      </div>
    </aside>
  );
}
