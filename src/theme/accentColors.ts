export type AccentColor =
  | "blue"
  | "purple"
  | "pink"
  | "orange"
  | "green"
  | "cyan"
  | "silver";

type AccentColorLabelKey =
  | "appearance.colorBlue"
  | "appearance.colorPurple"
  | "appearance.colorPink"
  | "appearance.colorOrange"
  | "appearance.colorGreen"
  | "appearance.colorCyan"
  | "appearance.colorSilver";

interface AccentColorDefinition {
  labelKey: AccentColorLabelKey;
  swatch: string;
  base: string;
}

const ACCENT_COLOR_DEFINITIONS: Record<AccentColor, AccentColorDefinition> = {
  blue: {
    labelKey: "appearance.colorBlue",
    swatch: "#2b6eff",
    base: "#2b6eff",
  },
  purple: {
    labelKey: "appearance.colorPurple",
    swatch: "#a855f7",
    base: "#8b5cf6",
  },
  pink: {
    labelKey: "appearance.colorPink",
    swatch: "#f43f5e",
    base: "#e11d48",
  },
  orange: {
    labelKey: "appearance.colorOrange",
    swatch: "#f59e0b",
    base: "#d97706",
  },
  green: {
    labelKey: "appearance.colorGreen",
    swatch: "#10b981",
    base: "#059669",
  },
  cyan: {
    labelKey: "appearance.colorCyan",
    swatch: "#0ea5e9",
    base: "#0284c7",
  },
  silver: {
    labelKey: "appearance.colorSilver",
    swatch: "#94a3b8",
    base: "#64748b",
  },
};

export const DEFAULT_ACCENT_COLOR: AccentColor = "blue";

export const ACCENT_COLOR_OPTIONS = (
  Object.entries(ACCENT_COLOR_DEFINITIONS) as Array<
    [AccentColor, AccentColorDefinition]
  >
).map(([value, definition]) => ({
  value,
  labelKey: definition.labelKey,
  swatch: definition.swatch,
}));

type ThemeMode = "light" | "dark";

type AccentCssVariable =
  | "--theme-primary"
  | "--theme-primary-hover"
  | "--theme-primary-text"
  | "--theme-primary-glow"
  | "--theme-primary-soft"
  | "--theme-primary-soft-mid"
  | "--theme-primary-soft-hover"
  | "--theme-primary-soft-strong"
  | "--accent-primary"
  | "--accent-primary-strong"
  | "--accent-muted"
  | "--focus-ring";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const DARK_TEXT = "#0f172a";
const LIGHT_TEXT = "#ffffff";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(hex: string): string {
  const sanitized = hex.replace("#", "").trim();

  if (sanitized.length === 3) {
    return sanitized
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }

  return sanitized;
}

function hexToRgb(hex: string): RgbColor {
  const normalized = normalizeHex(hex);
  const safeHex = /^[0-9a-fA-F]{6}$/.test(normalized) ? normalized : "2b6eff";
  const value = Number.parseInt(safeHex, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex({ r, g, b }: RgbColor): string {
  return `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixHex(sourceHex: string, targetHex: string, targetWeight: number): string {
  const source = hexToRgb(sourceHex);
  const target = hexToRgb(targetHex);
  const weight = clamp(targetWeight, 0, 1);

  return rgbToHex({
    r: source.r * (1 - weight) + target.r * weight,
    g: source.g * (1 - weight) + target.g * weight,
    b: source.b * (1 - weight) + target.b * weight,
  });
}

function toRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  const safeAlpha = clamp(alpha, 0, 1);
  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
}

function toLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getReadableTextColor(hex: string): string {
  return getLuminance(hex) > 0.5 ? DARK_TEXT : LIGHT_TEXT;
}

function getAccentDefinition(accentColor: AccentColor | string): AccentColorDefinition {
  if (accentColor in ACCENT_COLOR_DEFINITIONS) {
    return ACCENT_COLOR_DEFINITIONS[accentColor as AccentColor];
  }

  return ACCENT_COLOR_DEFINITIONS[DEFAULT_ACCENT_COLOR];
}

export function getAccentCssVariables(
  accentColor: AccentColor | string,
  theme: ThemeMode,
): Record<AccentCssVariable, string> {
  const accent = getAccentDefinition(accentColor);
  const themePrimary = accent.base;
  const themePrimaryHover = mixHex(
    themePrimary,
    "#000000",
    theme === "dark" ? 0.2 : 0.12,
  );
  const accentPrimary =
    theme === "dark"
      ? mixHex(themePrimary, "#ffffff", 0.34)
      : mixHex(themePrimary, "#000000", 0.22);
  const accentPrimaryStrong =
    theme === "dark"
      ? mixHex(themePrimary, "#ffffff", 0.24)
      : mixHex(themePrimary, "#000000", 0.3);

  return {
    "--theme-primary": themePrimary,
    "--theme-primary-hover": themePrimaryHover,
    "--theme-primary-text": getReadableTextColor(themePrimary),
    "--theme-primary-glow": toRgba(themePrimary, theme === "dark" ? 0.48 : 0.42),
    "--theme-primary-soft": toRgba(themePrimary, 0.1),
    "--theme-primary-soft-mid": toRgba(themePrimary, 0.15),
    "--theme-primary-soft-hover": toRgba(themePrimary, 0.2),
    "--theme-primary-soft-strong": toRgba(themePrimary, 0.25),
    "--accent-primary": accentPrimary,
    "--accent-primary-strong": accentPrimaryStrong,
    "--accent-muted": toRgba(accentPrimary, theme === "dark" ? 0.22 : 0.12),
    "--focus-ring": toRgba(accentPrimary, theme === "dark" ? 0.38 : 0.3),
  };
}
