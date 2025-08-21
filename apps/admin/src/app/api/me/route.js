// app/api/me/route.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/config/db";
import User from "@/db/schema/User";

export async function GET(request) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = verifyToken(token);

    console.log("Token:", token);
    console.log("Decoded:", decoded);

    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ user: null }, { status: 403 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
