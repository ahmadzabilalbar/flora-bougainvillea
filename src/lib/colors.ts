const NAMED: Record<string, [string, string]> = {
  crimson: ["#be123c", "#fb7185"],
  red: ["#dc2626", "#f87171"],
  magenta: ["#c026d3", "#f0abfc"],
  fuchsia: ["#c026d3", "#f0abfc"],
  pink: ["#ec4899", "#fbcfe8"],
  purple: ["#7e22ce", "#c084fc"],
  violet: ["#7c3aed", "#c4b5fd"],
  orange: ["#ea580c", "#fdba74"],
  coral: ["#f43f5e", "#fda4af"],
  gold: ["#d97706", "#fcd34d"],
  yellow: ["#ca8a04", "#fde047"],
  white: ["#d6d3d1", "#fafaf9"],
  cream: ["#d6c7a1", "#fefce8"],
  peach: ["#fb923c", "#fed7aa"],
  salmon: ["#f97316", "#fecaca"],
  lavender: ["#a78bfa", "#ede9fe"],
};

/** Returns a [deep, light] colour pair for a free-text colour like "Deep Purple". */
export function bractColors(color: string): [string, string] {
  const c = color.toLowerCase();
  for (const [name, pair] of Object.entries(NAMED)) if (c.includes(name)) return pair;
  let h = 0;
  for (const ch of c || "bougainvillea") h = (h * 31 + ch.charCodeAt(0)) % 360;
  return [`hsl(${h} 70% 45%)`, `hsl(${h} 85% 82%)`];
}
