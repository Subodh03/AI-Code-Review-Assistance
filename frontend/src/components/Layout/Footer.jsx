const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-3 flex items-center justify-between text-xs text-ink-faint font-mono">
      <span>© {YEAR} AI Code Review Assistant</span>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-severity-success" />
          All systems operational
        </span>
        <a href="#" className="hover:text-ink-muted transition-colors">
          Docs
        </a>
        <a href="#" className="hover:text-ink-muted transition-colors">
          GitHub
        </a>
        <a href="#" className="hover:text-ink-muted transition-colors">
          Support
        </a>
        <span>v1.0.0</span>
      </div>
    </footer>
  );
}
