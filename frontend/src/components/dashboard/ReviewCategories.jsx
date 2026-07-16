import { Bug, ShieldAlert, Sparkles, Gauge, Type, FileText } from "lucide-react";

const CATEGORIES = [
  { icon: Bug, label: "Bug detection", bg: "bg-severity-critical-soft", fg: "text-severity-critical" },
  { icon: ShieldAlert, label: "Security recommendations", bg: "bg-severity-critical-soft", fg: "text-severity-critical" },
  { icon: Sparkles, label: "Code smell identification", bg: "bg-severity-warning-soft", fg: "text-severity-warning" },
  { icon: Gauge, label: "Performance optimization", bg: "bg-severity-info-soft", fg: "text-severity-info" },
  { icon: Type, label: "Naming suggestions", bg: "bg-accent/10", fg: "text-accent" },
  { icon: FileText, label: "Auto-generated docs", bg: "bg-severity-success-soft", fg: "text-severity-success" },
];

export default function ReviewCategories() {
  return (
    <div className="rounded-xl2 border border-border bg-surface p-5 shadow-card">
      <h2 className="font-display font-semibold mb-1">What the AI checks for</h2>
      <p className="text-xs text-ink-muted mb-4">Every submission is screened across these categories.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORIES.map(({ icon: Icon, label, bg, fg }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5"
          >
            <div className={`h-8 w-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={15} className={fg} />
            </div>
            <span className="text-xs text-ink-primary leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
