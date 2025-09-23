import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/config/db";
import User from "@/db/schema/User";

export async function POST(req) {
  await connectDB();
  const { token, newPassword } = await req.json();

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error resetting password." }, { status: 500 });
  }
}
