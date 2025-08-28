// app/api/wallet/out/route.js
import { NextResponse } from "next/server";
import { korapayRequest } from "@/lib/korapay";
import { logTransaction } from "@/lib/transactionLogger";

export async function POST(req) {
  const { userId, amount, currency, reference, bankCode, accountNumber, accountName } = await req.json();

  if (!["NGN", "USD"].includes(currency)) {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
  }

  // Create payout
  const response = await korapayRequest("payouts", "POST", {
    reference,
    destination: {
      type: "bank_account",
      amount,
      currency,
      narration: "Wallet withdrawal",
      bank_code: bankCode,
      account_number: accountNumber,
      account_name: accountName,
    },
  });

  // Log transaction (always)
  await logTransaction({
    userId,
    amount,
    currency,
    type: "DEBIT",
    description: "Withdrawal",
    reference,
    status: response.success ? "PENDING" : "FAILED",
    gatewayResponse: response.data,
  });

  return NextResponse.json(response.data, { status: response.success ? 200 : 400 });
}
