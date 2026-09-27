/**
 * Clerk is optional: with both keys set, every CRM route requires a signed-in
 * user; without them ZeroCRM runs as an open demo (no login).
 */
export const AUTH_ENABLED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
export const SIGN_IN_URL = "/sign-in";
export const SIGN_UP_URL = "/sign-up";
export const AFTER_AUTH_URL = "/companies";

/** Where to go after signing in: the page the proxy bounced from (same-origin paths only), else Companies. */
export function safeRedirect(raw: string | null) {
  if (!raw) return AFTER_AUTH_URL;
  try {
    const url = new URL(raw, "http://local");
    const path = `${url.pathname}${url.search}`;
    return (url.origin === "http://local" || (typeof window !== "undefined" && url.origin === window.location.origin)) && path.startsWith("/") && !path.startsWith("/sign-")
      ? path
      : AFTER_AUTH_URL;
  } catch {
    return AFTER_AUTH_URL;
  }
}
