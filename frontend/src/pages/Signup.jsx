import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Terminal } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="h-9 w-9 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
            <Terminal size={19} />
          </div>
          <span className="font-display font-semibold text-lg">Code Review Assistant</span>
        </div>

        <div className="rounded-xl2 border border-border bg-surface p-7 shadow-card">
          <h1 className="font-display font-semibold text-xl mb-1">Create your account</h1>
          <p className="text-sm text-ink-muted mb-6">Start reviewing code in minutes.</p>

          {error && (
            <div className="mb-4 rounded-lg bg-severity-critical-soft text-severity-critical text-sm px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Full name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
                placeholder="At least 8 characters"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-accent hover:bg-accent-hover transition-colors text-white text-sm font-medium py-2.5 disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-muted mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:text-accent-hover">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
