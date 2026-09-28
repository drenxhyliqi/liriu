import { NextResponse, type NextRequest } from "next/server";

// Optimistic check only: no session cookie means no point rendering the
// dashboard. The admin layout verifies the token with the API on every request.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("liriu_admin")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
