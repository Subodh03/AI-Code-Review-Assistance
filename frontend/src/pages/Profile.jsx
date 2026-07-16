import { useRef, useState } from "react";
import { Camera, Check, Upload } from "lucide-react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import Avatar from "../components/ui/Avatar";
import AvatarPicker from "../components/ui/AvatarPicker";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ name: user?.name || "", mobile_number: user?.mobile_number || "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isPreset = user?.avatar_url?.startsWith("preset:");
  const avatarSrc = user?.avatar_url
    ? user.avatar_url.startsWith("http") || isPreset
      ? user.avatar_url
      : `${API_ORIGIN}${user.avatar_url}`
    : null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const { data } = await api.put("/users/me", form);
      updateUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await api.put("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(data.user);
    } finally {
      setUploading(false);
    }
  };

  const handlePresetSelect = async (presetId) => {
    const { data } = await api.put("/users/me/avatar-preset", { preset: presetId });
    updateUser(data.user);
  };

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-lg space-y-6">
        <div className="rounded-xl2 border border-border bg-surface p-6 shadow-card flex items-center gap-5">
          <div className="relative">
            <Avatar name={user?.name} src={avatarSrc} size="lg" />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-accent hover:bg-accent-hover text-white flex items-center justify-center transition-colors"
              title="Upload a photo"
            >
              <Camera size={13} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg">{user?.name}</h2>
            <p className="text-sm text-ink-muted">{user?.email}</p>
            {uploading && <p className="text-xs text-accent mt-1">Uploading photo…</p>}
          </div>
        </div>

        <div className="rounded-xl2 border border-border bg-surface p-6 shadow-card">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display font-semibold">Choose an avatar</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover"
            >
              <Upload size={13} />
              Upload your own
            </button>
          </div>
          <p className="text-sm text-ink-muted mb-4">
            Pick one of these, or upload a photo above.
          </p>
          <AvatarPicker
            selected={isPreset ? user.avatar_url.replace("preset:", "") : null}
            onSelect={handlePresetSelect}
          />
        </div>

        <form onSubmit={handleSave} className="rounded-xl2 border border-border bg-surface p-6 shadow-card space-y-4">
          <h2 className="font-display font-semibold mb-1">Account details</h2>

          <div>
            <label className="block text-xs text-ink-muted mb-1.5">Full name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-ink-muted mb-1.5">Mobile number</label>
            <input
              value={form.mobile_number}
              onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
              placeholder="+1 555 123 4567"
              className="w-full rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-ink-muted mb-1.5">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full rounded-lg bg-surface-alt border border-border px-3 py-2.5 text-sm text-ink-faint cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent hover:bg-accent-hover transition-colors text-white text-sm font-medium px-4 py-2.5 disabled:opacity-60"
          >
            {saved && <Check size={15} />}
            {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
