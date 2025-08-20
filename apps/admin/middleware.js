// middleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/config/db";
import User from "@/db/schema/User";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ Allow login page and public auth endpoints
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/me")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await connectDB();
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("role");
    if (!user || user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware auth error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// ✅ Apply to every route (but we filtered above)
export const config = {
  matcher: ["/:path*"],
};
