import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, userId } = body;

    if (!amount || !userId) {
      return NextResponse.json(
        { error: "Amount and userId are required" },
        { status: 400 }
      );
    }

    const payload = {
      amount: amount.toString(), // must be string
      currency: "USDT",
      order_id: `${userId}-${Date.now()}`,
      network: "TRON", // or BSC/ETH depending on your setup
      url_callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/cryptomus/webhook`,
      url_success: `${process.env.NEXT_PUBLIC_APP_URL}/wallet/success`,
      url_failure: `${process.env.NEXT_PUBLIC_APP_URL}/wallet/failure`,
    };

    const response = await fetch("https://api.cryptomus.com/v1/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant:"e1845f40-a721-4ab6-9b76-4f29fcc14bee",
        sign: generateSignature(payload),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to create Cryptomus invoice" },
        { status: response.status }
      );
    }

    return NextResponse.json({ checkout_url: data.result.url }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Helper: create signature
import crypto from "crypto";

function generateSignature(payload) {
  const json = JSON.stringify(payload);
  return crypto
    .createHmac("sha256", process.env.CRYPTOMUS_PAYOUT_API_KEY)
    .update(json)
    .digest("hex");
}
