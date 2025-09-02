import crypto from "crypto";

export function signPayload(payload, apiKey) {
    const json = JSON.stringify(payload || "");
    console.log(crypto.createHmac("sha256", apiKey).update(json).digest("hex"));
      
}
const amount = 10;
const payload = {
    amount: amount.toString(), // must be string
    currency: "USDT",
    order_id: `random-${Date.now()}`,
    network: "TRON", // or BSC/ETH depending on your setup
    url_callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/cryptomus/webhook`,
    url_success: `${process.env.NEXT_PUBLIC_APP_URL}/wallet/success`,
    url_failure: `${process.env.NEXT_PUBLIC_APP_URL}/wallet/failure`,
};

signPayload(payload, "b934e766968f6fb5820396b7d5d3044505ba4fd6")