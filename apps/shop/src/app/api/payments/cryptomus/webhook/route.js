import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();

        // TODO: verify signature here like above
        const { order_id, status } = body;

        if (status === "paid") {
            // Update user balance in DB
            console.log(`Payment success for ${order_id}`);
        } else {
            console.log(`Payment status for ${order_id}: ${status}`);
        }

        return NextResponse.json({ message: "Webhook received" }, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { error: err.message || "Webhook error" },
            { status: 500 }
        );
    }
}
