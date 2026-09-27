import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AFTER_AUTH_URL, AUTH_ENABLED, SIGN_IN_URL, SIGN_UP_URL } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display serif for the editorial invoice templates only.
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZeroCRM",
  description: "ZeroCRM — an open-source, pixel-perfect sales CRM pipeline built with Next.js.",
  authors: [{ name: "ZeroFounder" }],
  creator: "ZeroFounder",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#161616",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} dark h-full antialiased`}
    >
      <body className="h-full">
        {AUTH_ENABLED ? (
          <ClerkProvider signInUrl={SIGN_IN_URL} signUpUrl={SIGN_UP_URL} signInFallbackRedirectUrl={AFTER_AUTH_URL} signUpFallbackRedirectUrl={AFTER_AUTH_URL} afterSignOutUrl={SIGN_IN_URL}>
            {children}
          </ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
