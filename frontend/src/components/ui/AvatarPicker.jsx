import {
  Cat,
  Bird,
  Rabbit,
  Squirrel,
  Fish,
  Turtle,
} from "lucide-react";

// Each preset renders as a colored circle with a simple line icon -- no external
// images or real photos, so there's no licensing concern and it loads instantly.
export const AVATAR_PRESETS = [
  { id: "moss", icon: Cat, bg: "#E9F2E9", fg: "#3F7D4F" },
  { id: "clay", icon: Bird, bg: "#FBEAE7", fg: "#B5432F" },
  { id: "harbor", icon: Fish, bg: "#E8F1FA", fg: "#2E6B98" },
  { id: "wheat", icon: Rabbit, bg: "#FDF3E3", fg: "#9C6B18" },
  { id: "pine", icon: Turtle, bg: "#E6F0EE", fg: "#16615A" },
  { id: "dune", icon: Squirrel, bg: "#F3F0E6", fg: "#8A8578" },
];

export function PresetAvatarIcon({ presetId, size = 44, className = "" }) {
  const preset = AVATAR_PRESETS.find((p) => p.id === presetId) || AVATAR_PRESETS[0];
  const Icon = preset.icon;
  return (
    <div
      className={`rounded-full flex items-center justify-center ring-1 ring-border-light ${className}`}
      style={{ width: size, height: size, backgroundColor: preset.bg }}
    >
      <Icon size={size * 0.5} color={preset.fg} strokeWidth={1.75} />
    </div>
  );
}

export default function AvatarPicker({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-6 gap-2.5">
      {AVATAR_PRESETS.map((preset) => {
        const Icon = preset.icon;
        const isSelected = selected === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.id)}
            className={`relative h-11 w-11 rounded-full flex items-center justify-center transition-all ${
              isSelected ? "ring-2 ring-accent ring-offset-2 ring-offset-surface" : "ring-1 ring-border-light hover:ring-border-light"
            }`}
            style={{ backgroundColor: preset.bg }}
            title={`${preset.id} avatar`}
          >
            <Icon size={20} color={preset.fg} strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}
