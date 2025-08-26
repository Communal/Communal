// app/api/wallet/in/route.js
import { NextResponse } from "next/server";
import { korapayRequest } from "@/lib/korapay";
import { logTransaction } from "@/lib/transactionLogger";

export async function POST(req) {
  const { userId, amount, currency, reference } = await req.json();

  // Ensure only NGN or USD
  if (!["NGN", "USD"].includes(currency)) {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
  }

  // Create Korapay charge
  const response = await korapayRequest("charges/initialize", "POST", {
    amount,
    currency,
    reference,
    redirect_url: `${process.env.APP_URL}/wallet/callback`,
    customer: {
      name: "Test User", // Replace with user data
      email: "user@example.com",
    },
  });

  // Log transaction (always)
  await logTransaction({
    userId,
    amount,
    currency,
    type: "CREDIT",
    description: "Wallet in",
    reference,
    status: response.success ? "PENDING" : "FAILED",
    gatewayResponse: response.data,
  });

  return NextResponse.json(response.data, { status: response.success ? 200 : 400 });
}
