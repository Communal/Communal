import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/db/schema/User";

export async function POST(req) {
  await connectDB();
  const { token } = await req.json();

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() }, // not expired
    });

    if (!user) {
      return NextResponse.json({ valid: false, error: "Invalid or expired token." }, { status: 400 });
    }

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ valid: false, error: "Error verifying token." }, { status: 500 });
  }
}
