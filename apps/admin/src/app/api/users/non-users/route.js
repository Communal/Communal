import { NextResponse } from "next/server";
import User from "@/db/schema/User";
import connectDB from "@/config/db"; // <-- your MongoDB connection helper

export async function GET() {
  try {
    await connectDB();

    // Count users whose role is NOT ADMIN
    const count = await User.countDocuments({ role: { $ne: "ADMIN" } });

    return NextResponse.json({ nonAdminCount: count }, { status: 200 });
  } catch (error) {
    console.error("Error fetching non-admin count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}