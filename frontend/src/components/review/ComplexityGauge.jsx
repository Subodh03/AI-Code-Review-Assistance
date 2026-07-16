// Simple linear gauge: complexity bands are heuristic, common thresholds
// used by tools like radon/lizard (<=10 simple, <=20 moderate, >20 complex).
function band(value) {
  if (value <= 10) return { label: "Simple", color: "bg-severity-success", text: "text-severity-success" };
  if (value <= 20) return { label: "Moderate", color: "bg-severity-warning", text: "text-severity-warning" };
  return { label: "Complex", color: "bg-severity-critical", text: "text-severity-critical" };
}

export default function ComplexityGauge({ value }) {
  const { label, color, text } = band(value);
  const pct = Math.min(100, (value / 30) * 100);

  return (
    <div className="rounded-xl2 border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-ink-muted font-mono">
          Cyclomatic complexity
        </span>
        <span className={`text-xs font-mono ${text}`}>{label}</span>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span className="font-display text-3xl font-semibold">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-alt overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
