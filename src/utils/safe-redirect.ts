/**
 * Guard for the `redirect` query parameter used by the login and sign-up pages.
 *
 * The app only ever builds internal paths for this parameter, but the value
 * arrives from the URL and was previously passed straight to `router.push`,
 * which follows absolute URLs. That turned `?redirect=https://evil.example`
 * into an open redirect on the real sign-in page (Ziki #785).
 *
 * Only a single-leading-slash path is returned; everything else falls back.
 */
export function safeRedirect(
  value: string | null | undefined,
  fallback: string = "/"
): string {
  if (!value) return fallback;

  const candidate = value.trim();

  // Must be an absolute *path*, not a URL.
  if (!candidate.startsWith("/")) return fallback;

  // `//host` and `/\host` are protocol-relative in browsers.
  if (candidate.startsWith("//") || candidate.startsWith("/\\")) {
    return fallback;
  }

  // Control characters and whitespace are used to smuggle schemes past naive
  // checks (`/\t/evil.example`); a legitimate path never contains them.
  if (/[\u0000-\u001F\u007F\s]/.test(candidate)) return fallback;

  return candidate;
}
