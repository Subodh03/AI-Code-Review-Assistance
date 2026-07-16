import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, Filter } from "lucide-react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { SeverityBadge } from "../components/ui/Badge";
import api from "../api/axios";

const SEVERITIES = ["critical", "warning", "info"];
const LANGUAGES = ["python", "javascript", "typescript"];

export default function History() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews", {
        params: { search: search || undefined, severity: severity || undefined, language: language || undefined },
      });
      setReviews(data.reviews);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [search, severity, language]);

  useEffect(() => {
    const t = setTimeout(fetchReviews, 300); // debounce search input
    return () => clearTimeout(t);
  }, [fetchReviews]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review? This can't be undone.")) return;
    await api.delete(`/reviews/${id}`);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setTotal((t) => t - 1);
  };

  return (
    <DashboardLayout title="Review history">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or code…"
            className="w-full rounded-lg bg-surface border border-border pl-9 pr-3 py-2.5 text-sm focus:border-accent outline-none"
          />
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-lg bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
        >
          <option value="">All languages</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="rounded-lg bg-surface border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
        >
          <option value="">All severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl2 border border-border bg-surface shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border text-xs text-ink-muted font-mono">
          <span className="flex items-center gap-1.5">
            <Filter size={12} /> {total} review{total !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-ink-muted font-mono">Loading…</div>
        ) : reviews.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-muted">No reviews match these filters.</div>
        ) : (
          <ul className="divide-y divide-border">
            {reviews.map((r) => (
              <li key={r.id} className="flex items-center justify-between px-4 py-3.5 hover:bg-surface-hover transition-colors group">
                <Link to={`/reviews/${r.id}`} className="min-w-0 flex-1">
                  <p className="text-sm text-ink-primary truncate">{r.title}</p>
                  <p className="text-xs text-ink-faint font-mono mt-1">
                    {r.language} · {r.lines_of_code} LOC · complexity {r.cyclomatic_complexity} ·{" "}
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </Link>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {Object.entries(r.severity_summary || {}).map(([sev, count]) => (
                    <SeverityBadge key={sev} severity={sev} label={count} />
                  ))}
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-faint hover:text-severity-critical p-1.5"
                    title="Delete review"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
