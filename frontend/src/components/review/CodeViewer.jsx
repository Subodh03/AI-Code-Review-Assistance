const DOT_COLOR = {
  critical: "bg-severity-critical",
  warning: "bg-severity-warning",
  info: "bg-severity-info",
};

export default function CodeViewer({ code, issues = [] }) {
  const lines = code.split(/\r\n|\r|\n/);

  // Map line number -> issues on that line (highest severity wins the dot color)
  const issuesByLine = {};
  for (const issue of issues) {
    if (!issue.line_number) continue;
    if (!issuesByLine[issue.line_number]) issuesByLine[issue.line_number] = [];
    issuesByLine[issue.line_number].push(issue);
  }

  const severityRank = { critical: 3, warning: 2, info: 1 };

  return (
    <div className="rounded-xl2 border border-border bg-surface overflow-hidden">
      <div className="border-b border-border px-4 py-2 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-severity-critical/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-severity-warning/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-severity-success/60" />
        <span className="ml-2 text-xs font-mono text-ink-faint">annotated source</span>
      </div>
      <div className="overflow-x-auto scrollbar-thin max-h-[560px]">
        <table className="w-full font-mono text-[13px] leading-6 border-collapse">
          <tbody>
            {lines.map((line, i) => {
              const lineNum = i + 1;
              const lineIssues = (issuesByLine[lineNum] || []).sort(
                (a, b) => severityRank[b.severity] - severityRank[a.severity]
              );
              const topSeverity = lineIssues[0]?.severity;

              return (
                <tr key={lineNum} className={topSeverity ? "bg-surface-hover/40" : ""}>
                  <td className="w-8 select-none text-center align-top pt-0.5">
                    {topSeverity && (
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${DOT_COLOR[topSeverity]}`}
                        title={lineIssues.map((i) => i.message).join(" | ")}
                      />
                    )}
                  </td>
                  <td className="w-10 select-none text-right pr-3 text-ink-faint align-top">{lineNum}</td>
                  <td className="pr-4 whitespace-pre text-ink-primary/90">{line || " "}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
