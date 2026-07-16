export default function StatCard({ label, value, sub, accentClass = "text-ink-primary", icon: Icon }) {
  return (
    <div className="rounded-xl2 border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between">
        <span className="text-xs uppercase tracking-wider text-ink-muted font-mono">{label}</span>
        {Icon && <Icon size={16} className="text-ink-faint" />}
      </div>
      <div className={`mt-3 font-display text-3xl font-semibold ${accentClass}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-ink-muted">{sub}</div>}
    </div>
  );
}
