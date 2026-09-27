import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const AUTH_ENABLED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;
const isPublic = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const withAuth = clerkMiddleware(
  async (auth, req) => {
    if (!isPublic(req)) await auth.protect();
  },
  { signInUrl: "/sign-in", signUpUrl: "/sign-up" },
);

/** Requires a Clerk session on every CRM route when Clerk is configured; otherwise a pass-through (open demo). */
export default AUTH_ENABLED ? withAuth : () => NextResponse.next();

export const config = {
  matcher: [
    // Everything except Next internals and static files…
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // …and always for API routes / server actions.
    "/(api|trpc)(.*)",
    // Clerk's frontend-API auto-proxy.
    "/__clerk/:path*",
  ],
};
