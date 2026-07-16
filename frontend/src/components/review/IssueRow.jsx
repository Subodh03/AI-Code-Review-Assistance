import { useState } from "react";
import { ChevronDown, Bug, ShieldAlert, Sparkles, Gauge, Type } from "lucide-react";
import { SeverityBadge } from "../ui/Badge";

const CATEGORY_ICON = {
  bug: Bug,
  security: ShieldAlert,
  code_smell: Sparkles,
  performance: Gauge,
  naming: Type,
};

export default function IssueRow({ issue }) {
  const [open, setOpen] = useState(false);
  const Icon = CATEGORY_ICON[issue.category] || Sparkles;

  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-hover transition-colors"
      >
        <Icon size={16} className="text-ink-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-ink-primary truncate">{issue.message}</p>
          <div className="flex items-center gap-2 mt-1">
            {issue.line_number && (
              <span className="text-[11px] font-mono text-ink-faint">line {issue.line_number}</span>
            )}
            <span className="text-[11px] font-mono text-ink-faint uppercase">
              {issue.source === "ai" ? "AI review" : "static analysis"}
            </span>
          </div>
        </div>
        <SeverityBadge severity={issue.severity} />
        <ChevronDown
          size={16}
          className={`text-ink-faint transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && issue.suggestion && (
        <div className="px-4 pb-4 pt-1 border-t border-border">
          <p className="text-xs uppercase tracking-wide text-ink-faint font-mono mb-1">Suggested fix</p>
          <p className="text-sm text-ink-muted">{issue.suggestion}</p>
        </div>
      )}
    </div>
  );
}
