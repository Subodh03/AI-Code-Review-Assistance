import { useState } from "react";
import { Link } from "react-router-dom";
import { Terminal, MailCheck } from "lucide-react";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
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
          {sent ? (
            <div className="text-center py-4">
              <MailCheck size={28} className="text-accent mx-auto mb-3" />
              <h1 className="font-display font-semibold text-lg mb-1">Check your inbox</h1>
              <p className="text-sm text-ink-muted">
                If <span className="text-ink-primary">{email}</span> is registered, we've sent a
                password reset link.
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-display font-semibold text-xl mb-1">Reset your password</h1>
              <p className="text-sm text-ink-muted mb-6">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-ink-muted mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-accent hover:bg-accent-hover transition-colors text-white text-sm font-medium py-2.5 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-ink-muted mt-5">
          <Link to="/login" className="text-accent hover:text-accent-hover">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}
