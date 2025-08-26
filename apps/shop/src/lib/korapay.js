// lib/korapay.js
export async function korapayRequest(endpoint, method = "POST", body = {}) {
  try {
    const res = await fetch(`https://api.korapay.com/merchant/api/v1/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`,
      },
      body: method === "GET" ? undefined : JSON.stringify(body),
    });

    const data = await res.json();
    return { success: res.ok, data };
  } catch (err) {
    return { success: false, data: { message: err.message } };
  }
}
