export function stripCrLf(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function isSafeExternalUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

