
function computeScore(severityTotals = {}, totalReviews = 0) {
  if (!totalReviews) return null;
  const critical = severityTotals.critical || 0;
  const warning = severityTotals.warning || 0;
  const info = severityTotals.info || 0;
  const penalty = critical * 6 + warning * 2 + info * 0.5;
  return Math.max(0, Math.round(100 - penalty / Math.max(1, totalReviews)));
}

function band(score) {
  if (score >= 85) return { label: "Excellent", stroke: "stroke-severity-success", text: "text-severity-success" };
  if (score >= 65) return { label: "Good", stroke: "stroke-severity-info", text: "text-severity-info" };
  if (score >= 40) return { label: "Needs work", stroke: "stroke-severity-warning", text: "text-severity-warning" };
  return { label: "At risk", stroke: "stroke-severity-critical", text: "text-severity-critical" };
}

export default function QualityScore({ severityTotals, totalReviews }) {
  const score = computeScore(severityTotals, totalReviews);

  if (score === null) {
    return (
      <div className="rounded-xl2 border border-border bg-surface p-5 shadow-card flex flex-col items-center justify-center text-center">
        <span className="text-xs uppercase tracking-wider text-ink-muted font-mono mb-2">
          Code health score
        </span>
        <p className="text-sm text-ink-muted">Run a review to see your score.</p>
      </div>
    );
  }

  const { label, stroke, text } = band(score);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="rounded-xl2 border border-border bg-surface p-5 shadow-card flex flex-col items-center">
      <span className="text-xs uppercase tracking-wider text-ink-muted font-mono mb-3 self-start">
        Code health score
      </span>
      <div className="relative" style={{ width: 116, height: 116 }}>
        <svg width="116" height="116" viewBox="0 0 116 116" className="-rotate-90">
          <circle cx="58" cy="58" r={radius} fill="none" strokeWidth="9" className="stroke-surface-alt" />
          <circle
            cx="58"
            cy="58"
            r={radius}
            fill="none"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${stroke} transition-all duration-500`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold text-ink-primary">{score}</span>
          <span className="text-[10px] text-ink-faint font-mono">/ 100</span>
        </div>
      </div>
      <span className={`mt-3 text-xs font-medium ${text}`}>{label}</span>
    </div>
  );
}
