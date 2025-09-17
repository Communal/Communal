// app/api/wallet/in/route.js
import { NextResponse } from "next/server";

const CHANNEL_MAP = {
  card: "card",
  bank: "bank_transfer",
  pay_with_bank: "pay_with_bank",
  mobile_money: "mobile_money",
};

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      amount,
      currency,
      method,
      userId,
      name,
      email,
    } = body || {};

    // ---- Basic validation (fail early with helpful messages)
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
    }
    if (!currency) {
      return NextResponse.json({ error: "currency is required" }, { status: 400 });
    }

    const amountKobo = Math.round(Number(amount));
    if (!Number.isInteger(amountKobo) || amountKobo <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    const defaultChannel = CHANNEL_MAP[method] || undefined;
    const channels = defaultChannel ? [defaultChannel] : undefined;

    const reqUrl = new URL(req.url);
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${reqUrl.protocol}//${reqUrl.host}`;
    const redirect_url =
      process.env.NODE_ENV === "production"
        ? `${origin}/wallet/success`
        : `${origin}/wallet/success`;

    const notification_url = origin?.startsWith("http")
      ? `${origin}/api/wallet/webhook`
      : undefined;

    const secret = process.env.KORAPAY_SECRET_KEY;
    if (!secret) {

      return NextResponse.json(
        { error: "Server misconfig: KORAPAY_SECRET_KEY is not set" },
        { status: 500 }
      );
    }

    const payload = {
      reference: `ref_${Date.now()}_UID_${userId}`,
      amount: amountKobo,
      currency,
      redirect_url,
      customer: { email, name: name || undefined },
      metadata: { method },
    };
    if (channels) payload.channels = channels;
    if (defaultChannel) payload.default_channel = defaultChannel;
    if (notification_url) payload.notification_url = notification_url;

    const response = await fetch(
      "https://api.korapay.com/merchant/api/v1/charges/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data?.status === false) {
      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.error ||
            "Korapay request failed",
          details: data?.data || data,
        },
        { status: 400 }
      );
    }

    // Success: { status: true, data: { reference, checkout_url } }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/wallet/in:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
