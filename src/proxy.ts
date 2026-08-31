import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";

const LOCALE_PREFIX = /^\/([a-z]{2})(?=\/|$)/;

/** Remove a leading `/xx` locale segment, always returning a rooted path. */
function stripPrefix(pathname: string): string {
  const rest = pathname.replace(LOCALE_PREFIX, "");
  return rest === "" ? "/" : rest;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // --- Admin: auth gate, always English + LTR ---
  if (pathname.startsWith("/admin")) {
    const adminHeaders = new Headers(request.headers);
    adminHeaders.set("x-locale", "en");
    adminHeaders.set("x-pathname", pathname);
    const pass = () => NextResponse.next({ request: { headers: adminHeaders } });

    if (pathname === "/admin/login") return pass();
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!(await verifyAdminSessionToken(token))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return pass();
  }

  // Metadata image routes carry no locale.
  if (pathname.includes("/opengraph-image") || pathname.includes("/twitter-image")) {
    return NextResponse.next();
  }

  const prefixMatch = pathname.match(LOCALE_PREFIX);
  const prefix = prefixMatch?.[1];
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  // Explicit /ar/* is not canonical — the default locale lives at the root.
  if (prefix === DEFAULT_LOCALE) {
    return NextResponse.redirect(
      new URL(stripPrefix(pathname) + search, request.url)
    );
  }

  // A recognised /fr or /en prefix: rewrite to the bare path, remember the choice.
  if (isLocale(prefix) && prefix !== DEFAULT_LOCALE) {
    const locale: Locale = prefix;
    const canonicalPath = stripPrefix(pathname);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", locale);
    requestHeaders.set("x-pathname", canonicalPath);

    const response = NextResponse.rewrite(
      new URL(canonicalPath + search, request.url),
      { request: { headers: requestHeaders } }
    );
    if (cookieLocale !== locale) {
      response.cookies.set(LOCALE_COOKIE, locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  // Unprefixed path. A returning fr/en visitor is sent to their prefixed URL.
  if (cookieLocale === "fr" || cookieLocale === "en") {
    return NextResponse.redirect(
      new URL(`/${cookieLocale}${pathname === "/" ? "" : pathname}` + search, request.url)
    );
  }

  // Serve as the default locale (Arabic) at the root.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", DEFAULT_LOCALE);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Everything except Next internals, API routes, and metadata/asset files.
    "/((?!_next/static|_next/image|api|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|icon|apple-icon|opengraph-image).*)",
  ],
};
