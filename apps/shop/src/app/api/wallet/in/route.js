import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, currency, method } = body;
    const key = process.env.KORAPAY_SECRET_KEY; // Use secret key
    console.log(key);


    if (!amount || !currency || !method) {
      return NextResponse.json(
        { error: "amount, currency, and method are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.korapay.com/merchant/api/v1/charges/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer sk_test_SWVfHMxRdrHto6FDNKeygNT1Yr1bsFGqUSVipVbP`, // Secret key here
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference: `ref_${Date.now()}`,
          amount,
          currency,
          redirect_url:
            process.env.NODE_ENV === "production"
              ? `${process.env.NEXT_PUBLIC_APP_URL}/wallet/success`
              : "http://localhost:3000/wallet/success",
          notification_url:
            "https://webhook.site/1df69136-48f5-46d4-a8df-3a4d384a6b73",
          customer: {
            name: "Test User",
            email: "test@example.com",
          },
          metadata: {
            method,
          },
        }),
      }
    );

    console.log(response);


    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Korapay request failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in wallet/in:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
