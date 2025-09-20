import { NextResponse } from "next/server";
import Transaction from "@/db/schema/Transaction";
import mongoose from "mongoose";

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const IPN_CALLBACK_URL = process.env.NOWPAYMENTS_IPN_CALLBACK_URL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

async function safeJson(resp) {
    const text = await resp.text();
    try {
        return JSON.parse(text);
    } catch {
        console.error("❌ Non-JSON response:", text.slice(0, 200));
        return { raw: text };
    }
}

export async function POST(req) {
    try {
        const { userId, amount, pay_currency, description } = await req.json();

        if (!userId || !amount || !pay_currency) {
            return NextResponse.json(
                { error: "Missing required params" },
                { status: 400 }
            );
        }

        // 0. Check API Status
        const statusResp = await fetch("https://api.nowpayments.io/v1/status", {
            headers: { "x-api-key": NOWPAYMENTS_API_KEY, accept: "application/json" },
        });
        const statusData = await safeJson(statusResp);

        if (!statusResp.ok || statusData.message !== "OK") {
            return NextResponse.json(
                { error: "NOWPayments API unavailable", details: statusData },
                { status: statusResp.status }
            );
        }

        // 1. Create transaction in DB (PENDING)
        const reference = new mongoose.Types.ObjectId().toString();
        await Transaction.create({
            userId: new mongoose.Types.ObjectId(userId),
            reference,
            amount,
            type: "CREDIT",
            status: "PENDING",
            description: description || "Wallet top-up",
        });

        // 2. Create Invoice on NOWPayments
        const invoiceResp = await fetch("https://api.nowpayments.io/v1/invoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": NOWPAYMENTS_API_KEY,
                accept: "application/json",
            },
            body: JSON.stringify({
                price_amount: amount,
                price_currency: pay_currency,
                order_id: reference,
                order_description: description || `Deposit by user ${userId}`,
                ipn_callback_url: IPN_CALLBACK_URL,
                success_url: `${APP_URL}/wallet/success?ref=${reference}`,
                cancel_url: `${APP_URL}/wallet/cancel?ref=${reference}`,
            }),
        });

        const invoiceData = await safeJson(invoiceResp);
        if (!invoiceResp.ok) {
            await Transaction.updateOne({ reference }, { status: "FAILED" });
            return NextResponse.json(
                { error: "Failed to create invoice", details: invoiceData },
                { status: invoiceResp.status }
            );
        }

        // 3. Update transaction status
        await Transaction.updateOne(
            { reference },
            { status: "AWAITING_FUNDS" }
        );

        // 4. Return invoice link to frontend
        return NextResponse.json({
            reference,
            status: "AWAITING_FUNDS",
            invoice: invoiceData,
        });
    } catch (err) {
        console.error("NOWPayments /in route error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
