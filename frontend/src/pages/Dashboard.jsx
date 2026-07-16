import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Code2, GitBranch, AlertTriangle, ArrowUpRight, Plus } from "lucide-react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import StatCard from "../components/ui/StatCard";
import { SeverityBadge } from "../components/ui/Badge";
import HowItWorks from "../components/dashboard/HowItWorks";
import ReviewCategories from "../components/dashboard/ReviewCategories";
import ReviewsTrendChart from "../components/dashboard/ReviewsTrendChart";
import LanguageBreakdown from "../components/dashboard/LanguageBreakdown";
import QualityScore from "../components/dashboard/QualityScore";
import ActivityHeatmap from "../components/dashboard/ActivityHeatmap";
import EmptyReviewsIllustration from "../components/dashboard/EmptyReviewsIllustration";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/reviews/dashboard-stats")
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const severityEntries = stats
    ? Object.entries(stats.severityTotals || {}).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <DashboardLayout title={`Welcome back, ${user?.name?.split(" ")[0] || ""}`}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-muted">Here's what's happening across your code reviews.</p>
        <Link
          to="/submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium px-3.5 py-2 transition-colors"
        >
          <Plus size={16} />
          New review
        </Link>
      </div>

      {loading ? (
        <div className="text-ink-muted text-sm font-mono">Loading dashboard…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total reviews" value={stats?.total_reviews ?? 0} icon={FileText} />
            <StatCard label="Lines analyzed" value={stats?.total_loc ?? 0} icon={Code2} />
            <StatCard
              label="Avg. complexity"
              value={(stats?.avg_complexity ?? 0).toFixed(1)}
              icon={GitBranch}
            />
            <StatCard
              label="Critical issues"
              value={stats?.severityTotals?.critical ?? 0}
              accentClass="text-severity-critical"
              icon={AlertTriangle}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <ReviewsTrendChart data={stats?.trend || []} />
            </div>
            <LanguageBreakdown data={stats?.languageBreakdown || []} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <ActivityHeatmap data={stats?.trend || []} />
            </div>
            <QualityScore severityTotals={stats?.severityTotals} totalReviews={stats?.total_reviews} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 rounded-xl2 border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold">Recent reviews</h2>
                <Link
                  to="/history"
                  className="text-xs text-accent hover:text-accent-hover flex items-center gap-1"
                >
                  View all <ArrowUpRight size={13} />
                </Link>
              </div>

              {stats?.recentReviews?.length ? (
                <div className="space-y-2">
                  {stats.recentReviews.map((r) => (
                    <Link
                      key={r.id}
                      to={`/reviews/${r.id}`}
                      className="flex items-center justify-between rounded-lg border border-border px-3.5 py-3 hover:bg-surface-hover transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-ink-primary truncate">{r.title}</p>
                        <p className="text-xs text-ink-faint font-mono mt-0.5">
                          {r.language} · {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0 ml-3">
                        {Object.entries(r.severity_summary || {}).map(([sev, count]) => (
                          <SeverityBadge key={sev} severity={sev} label={count} />
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <EmptyReviewsIllustration className="w-32 h-24 mx-auto mb-3 text-ink-faint" />
                  <p className="text-sm text-ink-muted mb-3">No reviews yet.</p>
                  <Link to="/submit" className="text-sm text-accent hover:text-accent-hover">
                    Submit your first snippet →
                  </Link>
                </div>
              )}
            </div>

            <div className="rounded-xl2 border border-border bg-surface p-5 shadow-card">
              <h2 className="font-display font-semibold mb-4">Issue breakdown</h2>
              {severityEntries.length ? (
                <div className="space-y-3">
                  {severityEntries.map(([severity, count]) => {
                    const total = severityEntries.reduce((s, [, c]) => s + c, 0);
                    const pct = total ? (count / total) * 100 : 0;
                    return (
                      <div key={severity}>
                        <div className="flex justify-between text-xs mb-1">
                          <SeverityBadge severity={severity} />
                          <span className="text-ink-muted font-mono">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-surface-alt overflow-hidden">
                          <div
                            className={`h-full ${
                              severity === "critical"
                                ? "bg-severity-critical"
                                : severity === "warning"
                                ? "bg-severity-warning"
                                : "bg-severity-info"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-ink-muted">No issues recorded yet.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <HowItWorks />
            <ReviewCategories />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
