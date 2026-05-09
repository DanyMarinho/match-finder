/** Deterministic string hash (djb2-ish). */
export function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function seedRange(key: string, min: number, max: number): number {
  return min + (hash(key) % Math.max(1, max - min));
}
