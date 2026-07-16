import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#16615A", "#2E6B98", "#9C6B18", "#B5432F", "#3F7D4F", "#8A8578"];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { language, count } = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-surface px-2.5 py-1.5 shadow-card text-xs">
      <p className="text-ink-primary font-medium capitalize">{language}</p>
      <p className="text-ink-faint font-mono">{count} review{count !== 1 ? "s" : ""}</p>
    </div>
  );
}

export default function LanguageBreakdown({ data = [] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-xl2 border border-border bg-surface p-5 shadow-card">
      <h2 className="font-display font-semibold mb-1">Languages reviewed</h2>
      <p className="text-xs text-ink-muted mb-2">Where your submissions are coming from.</p>

      {data.length === 0 ? (
        <p className="text-sm text-ink-muted py-8 text-center">No data yet.</p>
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative shrink-0" style={{ width: 120, height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="language"
                  innerRadius={38}
                  outerRadius={56}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-display text-lg font-semibold text-ink-primary">{total}</span>
              <span className="text-[10px] text-ink-faint font-mono">total</span>
            </div>
          </div>

          <div className="flex-1 space-y-2 min-w-0">
            {data.map((d, i) => (
              <div key={d.language} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-primary capitalize truncate">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {d.language}
                </span>
                <span className="text-ink-faint font-mono shrink-0 ml-2">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
