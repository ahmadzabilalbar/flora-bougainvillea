// Shared by the gallery admin (browser) and the server actions: how photo names are compared.

/** Names match ignoring case and extra spaces ("Pink  Lady" = "pink lady"). Empty names never clash. */
export const nameKey = (name: string) => name.trim().replace(/\s+/g, " ").toLowerCase();

/** First of "Name 2", "Name 3", … whose key is not in `taken`. */
export function suggestName(name: string, taken: Set<string>) {
  const base = name.trim().replace(/\s+\d+$/, "") || "Photo";
  for (let n = 2; ; n++) {
    const candidate = `${base} ${n}`;
    if (!taken.has(nameKey(candidate))) return candidate;
  }
}
