function intensityClass(count, max) {
  if (count === 0) return "bg-surface-alt";
  const ratio = count / Math.max(1, max);
  if (ratio > 0.75) return "bg-accent";
  if (ratio > 0.5) return "bg-accent/70";
  if (ratio > 0.25) return "bg-accent/45";
  return "bg-accent/25";
}

export default function ActivityHeatmap({ data = [] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="rounded-xl2 border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display font-semibold">Activity</h2>
        <span className="text-xs text-ink-faint font-mono">last 14 days</span>
      </div>
      <p className="text-xs text-ink-muted mb-4">Darker squares mean more reviews that day.</p>

      <div className="flex gap-1.5">
        {data.map((d) => {
          const date = new Date(d.date);
          const label = date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
          return (
            <div key={d.date} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`h-8 w-full rounded-md ${intensityClass(d.count, max)} transition-colors`}
                title={`${label}: ${d.count} review${d.count !== 1 ? "s" : ""}`}
              />
              <span className="text-[9px] text-ink-faint font-mono">{date.getDate()}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] text-ink-faint font-mono">less</span>
        <span className="h-2.5 w-2.5 rounded-sm bg-surface-alt" />
        <span className="h-2.5 w-2.5 rounded-sm bg-accent/25" />
        <span className="h-2.5 w-2.5 rounded-sm bg-accent/45" />
        <span className="h-2.5 w-2.5 rounded-sm bg-accent/70" />
        <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
        <span className="text-[10px] text-ink-faint font-mono">more</span>
      </div>
    </div>
  );
}
