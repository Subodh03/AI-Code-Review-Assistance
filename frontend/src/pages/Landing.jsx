import { Link, Navigate } from "react-router-dom";
import {
  Terminal,
  ClipboardPaste,
  ScanSearch,
  Sparkles,
  ListChecks,
  Bug,
  ShieldAlert,
  Gauge,
  ArrowRight,
  Sun,
  Moon,
  Github,
  Twitter,
  Linkedin,
  Globe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const STEPS = [
  { icon: ClipboardPaste, title: "Submit your code", description: "Paste a snippet or upload a source file." },
  { icon: ScanSearch, title: "Static analysis", description: "Pylint checks syntax, unused variables, and style." },
  { icon: Sparkles, title: "AI review", description: "An AI model finds bugs, smells, and performance issues." },
  { icon: ListChecks, title: "Explore results", description: "Annotated source, ranked issues, suggested fixes." },
];

const FEATURES = [
  { icon: Bug, title: "Bug & security detection", description: "Catch real issues before a human reviewer has to." },
  { icon: Gauge, title: "Complexity metrics", description: "Cyclomatic complexity, function & class counts, LOC." },
  { icon: ShieldAlert, title: "Best-practice guidance", description: "Naming, structure, and documentation suggestions." },
];

const STATS = [
  { value: "3", label: "review categories combined" },
  { value: "< 30s", label: "typical review time" },
  { value: "2", label: "languages supported today" },
];

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "New review", to: "/submit" },
      { label: "History", to: "/history" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of use", href: "#" },
      { label: "Privacy policy", href: "#" },
    ],
  },
];

const FOOTER_LINKS = {
  Product: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "New review", to: "/submit" },
    { label: "History", to: "/history" },
    { label: "Pricing", to: "/signup" },
  ],
  Legal: [
    { label: "Terms of use", to: "#" },
    { label: "Privacy policy", to: "#" },
    { label: "Usage policy", to: "#" },
    { label: "Other policies", to: "#" },
  ],
};

// A static illustration of an annotated review -- reinforces the actual
// product's signature visual (severity-dotted gutter) right in the hero.
function AnnotatedCodePreview() {
  const lines = [
    { code: "def calculate_total(items):", dot: null },
    { code: "    total = 0", dot: null },
    { code: "    for i in range(len(items)):", dot: "warning" },
    { code: "        total = total + items[i].price", dot: null },
    { code: "    passwd = \"admin123\"", dot: "critical" },
    { code: "    return total", dot: null },
  ];
  const dotColor = { critical: "bg-severity-critical", warning: "bg-severity-warning" };

  return (
    <div className="rounded-xl2 border border-border bg-surface shadow-card overflow-hidden">
      <div className="border-b border-border px-4 py-2.5 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-severity-critical/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-severity-warning/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-severity-success/60" />
        <span className="ml-2 text-xs font-mono text-ink-faint">billing.py — reviewed</span>
      </div>
      <div className="font-mono text-[12.5px] leading-7 px-1 py-2">
        {lines.map((line, i) => (
          <div key={i} className={`flex px-3 ${line.dot ? "bg-surface-hover/60" : ""}`}>
            <span className="w-5 shrink-0 pt-0.5">
              {line.dot && <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor[line.dot]}`} />}
            </span>
            <span className="w-6 shrink-0 text-ink-faint select-none">{i + 1}</span>
            <span className="whitespace-pre text-ink-primary/90">{line.code}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-severity-critical shrink-0" />
          <span className="text-ink-muted">Hardcoded credential detected — move to environment variables</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-severity-warning shrink-0" />
          <span className="text-ink-muted">Use enumerate() instead of range(len(...))</span>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-bg text-ink-primary">
      <div className="h-[3px] bg-gradient-to-r from-accent via-severity-info to-accent" />
      <header className="border-b border-border sticky top-0 bg-bg/80 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <Terminal size={17} />
            </div>
            <span className="font-display font-semibold">Code Review Assistant</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-surface-hover hover:text-ink-primary transition-colors"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle color theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link to="/login" className="text-sm text-ink-muted hover:text-ink-primary">
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-accent hover:bg-accent-hover text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium font-mono px-3 py-1 mb-5">
            <Sparkles size={12} />
            Static analysis + AI, together
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight mb-5">
            Code review, without waiting for a senior dev
          </h1>
          <p className="text-ink-muted text-lg mb-8 max-w-lg">
            Paste a snippet or upload a file. Get static analysis and an AI-powered review —
            bugs, code smells, complexity, and documentation — in seconds.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get started
              <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="text-sm text-ink-muted hover:text-ink-primary">
              Already have an account?
            </Link>
          </div>
          <p className="text-xs text-ink-faint mt-3">Free to try. No credit card required.</p>
        </div>

        <AnnotatedCodePreview />
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10 border-y border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl font-semibold text-accent">{s.value}</div>
              <div className="text-xs text-ink-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="rounded-xl2 border border-border bg-surface p-8 shadow-card">
          <h2 className="font-display font-semibold text-xl mb-6 text-center">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {STEPS.map(({ icon: Icon, title, description }, i) => (
              <div key={title}>
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-accent" />
                </div>
                <p className="text-sm font-medium mb-1">
                  <span className="text-ink-faint font-mono text-xs mr-1.5">0{i + 1}</span>
                  {title}
                </p>
                <p className="text-xs text-ink-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="font-display font-semibold text-xl mb-6 text-center">
          Everything a review needs to cover
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl2 border border-border bg-surface p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <Icon size={18} className="text-accent" />
              </div>
              <h3 className="font-display font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-ink-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="rounded-xl2 border border-border bg-gradient-to-br from-accent/10 to-transparent p-10">
          <h2 className="font-display font-semibold text-2xl mb-3">Ready to see it on your own code?</h2>
          <p className="text-ink-muted mb-6">Create a free account and run your first review in under a minute.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Get started
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-3">
              <Terminal size={17} />
            </div>
            <p className="text-xs text-ink-muted max-w-[180px]">
              Static analysis and AI-powered code review, without the wait.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold text-ink-faint uppercase tracking-wide font-mono mb-3">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) =>
                  link.to ? (
                    <li key={link.label}>
                      <Link to={link.to} className="text-sm text-ink-muted hover:text-ink-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-ink-muted hover:text-ink-primary transition-colors">
                        {link.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border">
          <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-faint">
            <span>© 2026 Code Review Assistant</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-ink-muted transition-colors" aria-label="GitHub">
                <Github size={16} />
              </a>
              <a href="#" className="hover:text-ink-muted transition-colors" aria-label="X (Twitter)">
                <Twitter size={16} />
              </a>
              <a href="#" className="hover:text-ink-muted transition-colors" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <span className="flex items-center gap-1.5 pl-2 border-l border-border">
                <Globe size={13} />
                English
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
