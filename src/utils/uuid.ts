/** Client-side id generator for draft items (list keys, local-only records) — never used for persisted entity ids, which the backend assigns. */
export function randomUUID(): string {
  return crypto.randomUUID();
}
