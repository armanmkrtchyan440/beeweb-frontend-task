import { getServerSession } from "@/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getServerSession();

  if (pathname.startsWith("/ac") && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (pathname.startsWith("/auth") && session) {
    return NextResponse.redirect(new URL("/ac", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ac/:path*", "/auth/:path*"],
};
