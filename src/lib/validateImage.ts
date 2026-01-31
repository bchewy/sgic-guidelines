import { MAX_FILE_SIZE } from "./constants";

export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
]);

export function validateFile(file: File): ValidationResult {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, reason: "Unsupported format. Use JPG, PNG, or HEIC." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      reason: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 8MB.`,
    };
  }
  return { ok: true };
}
