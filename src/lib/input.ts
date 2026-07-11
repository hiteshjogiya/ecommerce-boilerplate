export function sanitizeSearchQuery(input: string, maxLength = 64) {
  return input
    .replace(/[^a-zA-Z0-9\s\-]/g, "")
    .trim()
    .slice(0, maxLength);
}
