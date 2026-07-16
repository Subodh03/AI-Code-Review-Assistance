import { ClipboardPaste, ScanSearch, Sparkles, ListChecks } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Submit your code",
    description: "Paste a snippet or upload a source file.",
    bg: "bg-severity-info-soft",
    fg: "text-severity-info",
  },
  {
    icon: ScanSearch,
    title: "Static analysis",
    description: "Pylint checks for syntax errors, unused variables, and style issues.",
    bg: "bg-severity-warning-soft",
    fg: "text-severity-warning",
  },
  {
    icon: Sparkles,
    title: "AI review",
    description: "An AI model looks for bugs, code smells, and performance issues.",
    bg: "bg-accent/10",
    fg: "text-accent",
  },
  {
    icon: ListChecks,
    title: "Explore results",
    description: "Browse annotated source, severity-ranked issues, and suggested fixes.",
    bg: "bg-severity-success-soft",
    fg: "text-severity-success",
  },
];

export default function HowItWorks() {
  return (
    <div className="rounded-xl2 border border-border bg-surface p-5 shadow-card">
      <h2 className="font-display font-semibold mb-4">How a review works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map(({ icon: Icon, title, description, bg, fg }, i) => (
          <div key={title} className="relative">
            <div className={`h-10 w-10 rounded-full ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={fg} />
            </div>
            <p className="text-sm font-medium text-ink-primary mb-1">
              <span className="text-ink-faint font-mono text-xs mr-1.5">0{i + 1}</span>
              {title}
            </p>
            <p className="text-xs text-ink-muted leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
