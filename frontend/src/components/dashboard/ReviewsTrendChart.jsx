import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

function formatDay(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-2.5 py-1.5 shadow-card text-xs">
      <p className="text-ink-faint font-mono">{formatDay(label)}</p>
      <p className="text-ink-primary font-medium">{payload[0].value} review{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

export default function ReviewsTrendChart({ data = [] }) {
  return (
    <div className="rounded-xl2 border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display font-semibold">Reviews over time</h2>
        <span className="text-xs text-ink-faint font-mono">last 14 days</span>
      </div>
      <p className="text-xs text-ink-muted mb-4">How often you're submitting code for review.</p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--color-accent))" stopOpacity={0.25} />
              <stop offset="100%" stopColor="rgb(var(--color-accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatDay}
            tick={{ fontSize: 10, fill: "#8A8578" }}
            axisLine={{ stroke: "#E7E2D6" }}
            tickLine={false}
            interval={2}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="rgb(var(--color-accent))"
            strokeWidth={2}
            fill="url(#trendFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
