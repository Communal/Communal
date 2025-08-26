// app/api/wallet/in/route.js
import { NextResponse } from "next/server";
import { korapayRequest } from "@/lib/korapay";
// import { logTransaction } from "@/lib/transactionLogger";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function POST(req) {
  try {
    const { amount, currency } = await req.json();
    const user = await getUserFromToken();

    const payload = {
      amount,
      currency: currency || "NGN",
      redirect_url: "https://your-app.com/payment/callback",
      payment_reference: `txn_${Date.now()}`,
      customer: {
        name: user.name,
        email: user.email,
      },
    };

    const response = await korapayRequest("/charges/initialize", "POST", payload);

    // ✅ Log the attempt
    // await logTransaction({
    //   userId: user._id,
    //   reference: payload.payment_reference,
    //   amount,
    //   type: "CREDIT",
    //   status: response.status === "success" ? "SUCCESS" : "FAILED",
    //   description: "Wallet in",
    // });

    // ✅ Send checkout_url back
    return NextResponse.json({
      checkout_url: response.data.checkout_url,
      reference: payload.payment_reference,
    });
  } catch (error) {
    console.error("Wallet In Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
