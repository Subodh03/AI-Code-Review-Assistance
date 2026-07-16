const SEVERITY_STYLES = {
  critical: "bg-severity-critical-soft text-severity-critical",
  warning: "bg-severity-warning-soft text-severity-warning",
  info: "bg-severity-info-soft text-severity-info",
  success: "bg-severity-success-soft text-severity-success",
};

export function SeverityBadge({ severity, label }) {
  const style = SEVERITY_STYLES[severity] || SEVERITY_STYLES.info;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-mono uppercase tracking-wide ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label || severity}
    </span>
  );
}

export function Pill({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border-light px-2.5 py-1 text-xs text-ink-muted font-mono ${className}`}
    >
      {children}
    </span>
  );
}
