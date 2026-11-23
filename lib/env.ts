/** Returns the names of any env vars in `names` that are missing or blank. */
export function missingEnv(names: readonly string[]): string[] {
  return names.filter((name) => !process.env[name]?.trim());
}
