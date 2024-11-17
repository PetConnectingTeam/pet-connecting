import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

export default async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const defaultLocale =
    request.headers.get("accept-language")?.split(",")[0].split("-")[0] ?? "en";

  if (
    (request.nextUrl.pathname.startsWith("/en") ||
      request.nextUrl.pathname.startsWith("/es")) &&
    !accessToken &&
    !request.nextUrl.pathname.startsWith(`/${defaultLocale}/signin`)
  ) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}/signin`, request.url)
    );
  }

  const handleI18nRouting = createMiddleware({
    locales: ["en", "es"],
    defaultLocale,
  });

  const response = handleI18nRouting(request);

  response.headers.set("x-your-custom-locale", defaultLocale);

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
