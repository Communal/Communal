import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../../../db/schema/User";
import dbConnect from "../../../config/db";

export async function GET(request) {
  await dbConnect();

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }
}
