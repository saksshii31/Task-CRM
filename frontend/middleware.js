import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  console.log("🟢 MIDDLEWARE HIT:", pathname);
  console.log("🟡 TOKEN:", token);

  // PUBLIC ROUTES
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgetPassword") ||
    pathname.startsWith("/resetPassword")
  ) {
    return NextResponse.next();
  }

  // BLOCK EVERYTHING ELSE
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/campaignManagement/:path*",
    "/emailTemplates/:path*",
    "/senders/:path*",
    "/contacts/:path*",
    "/contactLists/:path*",
    "/staffManagement/:path*",
    "/roles/:path*",
    "/profile/:path*",
    "/changePassword/:path*",
  ],
};
