import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import connectDB from "@/config/db";
import User from "@/db/schema/User";
import ResetPasswordEmail from "@/components/EmailTemplate"; // 👈 import template

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_EMAIL= process.env.RESEND_EMAIL;

export async function POST(req) {
    await connectDB();
    const { email } = await req.json();

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "No account found with that email." }, { status: 404 });
        }

        // Generate token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = Date.now() + 1000 * 60 * 60; // 1 hour
        user.resetToken = token;
        user.resetTokenExpires = expires;
        await user.save();

        // Reset link
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

        // Send email with React template
        await resend.emails.send({
            from: RESEND_EMAIL,
            to: user.email,
            subject: "Reset your password",
            react: ResetPasswordEmail({ resetLink, userEmail: user.email }),
        });

        return NextResponse.json({ message: "Password reset link sent to email." });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error sending reset email." }, { status: 500 });
    }
}
