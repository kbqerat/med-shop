export function buildQuery(
  current: Record<string, string | undefined>,
  updates: Record<string, string | undefined>
): string {
  const merged = { ...current, ...updates };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
