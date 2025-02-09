import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname.startsWith("/ac") && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/ac", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ac/:path*", "/auth/:path*"],
};
