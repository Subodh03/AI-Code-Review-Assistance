import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, FileCode, Hash, Boxes } from "lucide-react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import CodeViewer from "../components/review/CodeViewer";
import ComplexityGauge from "../components/review/ComplexityGauge";
import IssueRow from "../components/review/IssueRow";
import StatCard from "../components/ui/StatCard";
import api from "../api/axios";

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState("");

  useEffect(() => {
    api.get(`/reviews/${id}`).then(({ data }) => {
      setReview(data.review);
      setIssues(data.issues);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this review? This can't be undone.")) return;
    await api.delete(`/reviews/${id}`);
    navigate("/history");
  };

  const filteredIssues = severityFilter
    ? issues.filter((i) => i.severity === severityFilter)
    : issues;

  if (loading) {
    return (
      <DashboardLayout title="Review">
        <p className="text-sm text-ink-muted font-mono">Loading review…</p>
      </DashboardLayout>
    );
  }

  if (!review) {
    return (
      <DashboardLayout title="Review">
        <p className="text-sm text-ink-muted">Review not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={review.title}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-muted font-mono">
          {review.language} · {new Date(review.created_at).toLocaleString()}
        </p>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-sm text-severity-critical hover:opacity-80"
        >
          <Trash2 size={15} />
          Delete review
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Lines of code" value={review.lines_of_code} icon={FileCode} />
        <StatCard label="Functions" value={review.function_count} icon={Hash} />
        <StatCard label="Classes" value={review.class_count} icon={Boxes} />
        <ComplexityGauge value={review.cyclomatic_complexity} />
      </div>

      {review.ai_summary && (
        <div className="rounded-xl2 border border-border bg-surface p-5 shadow-card mb-6">
          <h2 className="font-display font-semibold mb-2">AI summary</h2>
          <p className="text-sm text-ink-muted whitespace-pre-line">{review.ai_summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display font-semibold mb-3">Source</h2>
          <CodeViewer code={review.code} issues={issues} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold">Issues ({filteredIssues.length})</h2>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-lg bg-surface border border-border px-2.5 py-1.5 text-xs focus:border-accent outline-none"
            >
              <option value="">All severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="rounded-xl2 border border-border bg-surface p-6 text-center text-sm text-ink-muted">
              No issues found for this filter. Nice and clean.
            </div>
          ) : (
            <div className="space-y-2 max-h-[560px] overflow-y-auto scrollbar-thin pr-1">
              {filteredIssues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
