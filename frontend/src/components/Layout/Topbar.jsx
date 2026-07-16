import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Avatar from "../ui/Avatar";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const avatarSrc = user?.avatar_url
    ? user.avatar_url.startsWith("http") || user.avatar_url.startsWith("preset:")
      ? user.avatar_url
      : `${API_ORIGIN}${user.avatar_url}`
    : null;

 const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-bg/80 backdrop-blur">
      <h1 className="font-display font-semibold text-lg">{title}</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-surface-hover hover:text-ink-primary transition-colors"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle color theme"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-hover transition-colors"
          >
            <Avatar name={user?.name} src={avatarSrc} size="sm" />
            <span className="text-sm text-ink-primary hidden sm:block">{user?.name}</span>
            <ChevronDown size={14} className="text-ink-muted" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-surface shadow-card py-1 z-20"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-severity-critical hover:bg-surface-hover"
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
