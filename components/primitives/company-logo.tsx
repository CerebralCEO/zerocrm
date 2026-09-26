import {
  siAirbnb,
  siApple,
  siHubspot,
  siIntercom,
  siNetflix,
  siPaypal,
  siShopify,
  siSnowflake,
  siSpotify,
  siStripe,
  siUnitedairlines,
  siZoom,
} from "simple-icons";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Glyph = { path: string; color: string };

const SIMPLE: Record<string, Glyph> = {
  apple: { path: siApple.path, color: "#ffffff" },
  snowflake: { path: siSnowflake.path, color: "#29B5E8" },
  stripe: { path: siStripe.path, color: "#635BFF" },
  zoom: { path: siZoom.path, color: "#2D8CFF" },
  intercom: { path: siIntercom.path, color: "#3ED1D6" },
  united: { path: siUnitedairlines.path, color: "#E5E5E5" },
  netflix: { path: siNetflix.path, color: "#E50914" },
  hubspot: { path: siHubspot.path, color: "#FF7A59" },
  spotify: { path: siSpotify.path, color: "#1ED760" },
  shopify: { path: siShopify.path, color: "#95BF47" },
  paypal: { path: siPaypal.path, color: "#1F8CFF" },
  airbnb: { path: siAirbnb.path, color: "#FF5A5F" },
};

/** Brands not shipped by simple-icons, drawn by hand. */
function CustomGlyph({ id }: { id: string }) {
  switch (id) {
    case "microsoft":
      return (
        <svg viewBox="0 0 24 24" className="size-full">
          <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022" />
          <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00" />
          <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF" />
          <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900" />
        </svg>
      );
    case "slack":
      return (
        <svg viewBox="0 0 24 24" className="size-full">
          <rect x="9.5" y="1" width="4" height="10" rx="2" fill="#36C5F0" />
          <rect x="1" y="10.5" width="10" height="4" rx="2" fill="#36C5F0" transform="translate(0 -1)" />
          <rect x="13" y="9.5" width="10" height="4" rx="2" fill="#2EB67D" />
          <rect x="14.5" y="1" width="4" height="7" rx="2" fill="#2EB67D" />
          <rect x="10.5" y="13" width="4" height="10" rx="2" fill="#ECB22E" />
          <rect x="16" y="14.5" width="7" height="4" rx="2" fill="#ECB22E" />
          <rect x="5.5" y="15" width="4" height="7" rx="2" fill="#E01E5A" />
          <rect x="1" y="15" width="7" height="4" rx="2" fill="#E01E5A" />
        </svg>
      );
    case "google":
      return (
        <svg viewBox="0 0 24 24" className="size-full">
          <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2-1.9 3.2-4.7 3.2-8.2z" />
          <path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7H2a11 11 0 0 0 0 9.9L5.7 14z" />
          <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 2 7l3.7 2.9C6.6 7.3 9.1 5.4 12 5.4z" />
        </svg>
      );
    case "attio":
      return (
        <svg viewBox="0 0 24 24" className="size-full" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
          <path d="M4 19 11 5" />
          <path d="M9.5 19l5.5-11" />
          <path d="M14 19h6" />
        </svg>
      );
    case "lvmh":
      return (
        <svg viewBox="0 0 24 24" className="size-full">
          <text x="12" y="14.5" textAnchor="middle" fontSize="6.4" fontWeight="600" fill="#9a9a9a" letterSpacing="0.4" fontFamily="serif">
            LVMH
          </text>
        </svg>
      );
    case "disney":
      return (
        <svg viewBox="0 0 24 24" className="size-full">
          <text x="12" y="15" textAnchor="middle" fontSize="8" fontStyle="italic" fontWeight="700" fill="#e5e5e5" fontFamily="cursive">
            Disney
          </text>
        </svg>
      );
    default:
      return null;
  }
}

const CUSTOM = new Set(["microsoft", "slack", "google", "attio", "lvmh", "disney"]);

export function CompanyLogo({
  id,
  src,
  size = 32,
  glyph,
  radius,
  className,
}: {
  id: string;
  src?: string;
  size?: number;
  /** Glyph size in px (defaults to ~50% of tile). */
  glyph?: number;
  radius?: number;
  className?: string;
}) {
  const g = glyph ?? Math.round(size * 0.5);
  const simple = SIMPLE[id];
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center overflow-hidden bg-muted-surface", className)}
      style={{ width: size, height: size, borderRadius: radius ?? Math.round(size * 0.22) }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : simple ? (
        <svg viewBox="0 0 24 24" style={{ width: g, height: g }} fill={simple.color}>
          <path d={simple.path} />
        </svg>
      ) : CUSTOM.has(id) ? (
        <span style={{ width: g, height: g }} className="flex">
          <CustomGlyph id={id} />
        </span>
      ) : (
        <Building2 style={{ width: g * 0.9, height: g * 0.9 }} className="text-fg-nav" strokeWidth={1.75} />
      )}
    </span>
  );
}
