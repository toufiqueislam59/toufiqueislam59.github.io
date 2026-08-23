export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB

export function isValidImageDataUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  if (!value.startsWith("data:image/")) return false;
  // Rough size check based on base64 payload length.
  const base64 = value.split(",")[1] ?? "";
  const approxBytes = Math.ceil((base64.length * 3) / 4);
  return approxBytes <= MAX_IMAGE_BYTES;
}
