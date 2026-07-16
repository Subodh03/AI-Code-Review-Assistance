import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, ClipboardPaste, Loader2 } from "lucide-react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import api from "../api/axios";

const LANGUAGES = ["python", "javascript", "typescript"];

export default function SubmitCode() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("paste");
  const [language, setLanguage] = useState("python");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let data;
      if (mode === "paste") {
        if (!code.trim()) throw new Error("Paste some code first.");
        const res = await api.post("/reviews/paste", { title, language, code });
        data = res.data;
      } else {
        if (!file) throw new Error("Choose a file to upload.");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", language);
        const res = await api.post("/reviews/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        data = res.data;
      }
      navigate(`/reviews/${data.review.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="New review">
      <div className="max-w-3xl">
        <p className="text-sm text-ink-muted mb-6">
          Submit a file or paste a snippet. It'll run through static analysis and an AI review.
        </p>

        <div className="inline-flex rounded-lg border border-border bg-surface p-1 mb-6">
          <button
            onClick={() => setMode("paste")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm transition-colors ${
              mode === "paste" ? "bg-accent text-white" : "text-ink-muted hover:text-ink-primary"
            }`}
          >
            <ClipboardPaste size={14} />
            Paste code
          </button>
          <button
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm transition-colors ${
              mode === "upload" ? "bg-accent text-white" : "text-ink-muted hover:text-ink-primary"
            }`}
          >
            <UploadCloud size={14} />
            Upload file
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-severity-critical-soft text-severity-critical text-sm px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-xl2 border border-border bg-surface p-5 shadow-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Title (optional)</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. auth_helper.py"
                className="w-full rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {mode === "paste" ? (
            <div>
              <label className="block text-xs text-ink-muted mb-1.5">Code</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={16}
                placeholder="Paste your source code here…"
                className="w-full rounded-lg bg-surface-alt border border-border px-3 py-3 text-sm font-mono focus:border-accent outline-none resize-y"
              />
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border-2 border-dashed border-border-light hover:border-accent transition-colors py-12 text-center cursor-pointer"
            >
              <UploadCloud size={26} className="mx-auto mb-2 text-ink-faint" />
              <p className="text-sm text-ink-muted">
                {file ? (
                  <span className="text-ink-primary font-mono">{file.name}</span>
                ) : (
                  <>Click to choose a file, or drag it here</>
                )}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-accent hover:bg-accent-hover transition-colors text-white text-sm font-medium px-4 py-2.5 disabled:opacity-60"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            {submitting ? "Running review…" : "Run review"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
