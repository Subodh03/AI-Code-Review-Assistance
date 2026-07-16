import { PresetAvatarIcon } from "./AvatarPicker";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-20 w-20 text-2xl",
};

const PIXEL_SIZES = { sm: 32, md: 44, lg: 80 };

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function Avatar({ name, src, size = "md", className = "" }) {
  const dimension = SIZES[size] || SIZES.md;

  if (src?.startsWith("preset:")) {
    const presetId = src.replace("preset:", "");
    return <PresetAvatarIcon presetId={presetId} size={PIXEL_SIZES[size] || 44} className={className} />;
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s avatar` : "User avatar"}
        className={`${dimension} rounded-full object-cover ring-1 ring-border-light ${className}`}
      />
    );
  }

  return (
    <div
      className={`${dimension} rounded-full bg-accent/15 text-accent flex items-center justify-center font-display font-semibold ring-1 ring-border-light ${className}`}
      aria-hidden="true"
    >
      {initials(name) || "?"}
    </div>
  );
}
