import type { MetadataRoute } from "next";

/** Web app manifest — makes ZeroCRM installable (desktop, Android, iOS home screen). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ZeroCRM",
    short_name: "ZeroCRM",
    description: "Pipeline, forecast, activities and invoices — a fast, open-source sales CRM.",
    start_url: "/companies",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone"],
    orientation: "any",
    background_color: "#161616",
    theme_color: "#161616",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Deals Board", url: "/deals", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Forecast", url: "/forecast", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Activities", url: "/activities", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Invoices", url: "/invoices", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
    screenshots: [
      { src: "/screenshots/desktop.png", sizes: "1920x1080", type: "image/png", form_factor: "wide", label: "Companies pipeline" },
      { src: "/screenshots/mobile.png", sizes: "780x1688", type: "image/png", form_factor: "narrow", label: "ZeroCRM on mobile" },
    ],
  };
}
