/**
 * Single source of truth for brand + SEO constants (metadata, JSON-LD, sitemap,
 * robots, OG images). Set SITE_URL in production to the canonical https origin —
 * everything URL-based is derived from it.
 */

const rawUrl = process.env.SITE_URL?.trim() || "http://localhost:3000";

export const SITE = {
  /** Canonical origin, no trailing slash. */
  url: rawUrl.replace(/\/+$/, ""),
  name: "Med Shop",
  shortName: "Med Shop",
  /** Used as the default meta description and OG description. */
  description:
    "Authentic caps from the brands you love — checked by hand and delivered across Morocco with cash on delivery.",
  tagline: "Headwear for the streets.",
  locale: "en_US",
  /** Brand green — matches --accent in globals.css. */
  themeColor: "#15803d",
  phoneDisplay: "06 00 02 90 60",
  phoneE164: "+212600029060",
  email: "Medamri4848@gmail.com",
  whatsappNumber: "212600029060",
  addressLocality: "Oujda",
  addressCountry: "MA",
  instagramUrl: "https://www.instagram.com/casquette.mr.ar",
  facebookUrl: "https://www.facebook.com/profile.php?id=61559633066516",
  /** Public profiles for schema.org `sameAs`. */
  sameAs: [
    "https://www.instagram.com/casquette.mr.ar",
    "https://www.facebook.com/profile.php?id=61559633066516",
  ] as string[],
} as const;

/** Join a path onto the canonical origin. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE.url}/`).toString();
}
