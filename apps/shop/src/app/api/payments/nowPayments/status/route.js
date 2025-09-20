import { NextResponse } from 'next/server';

const API_KEY = process.env.NOWPAYMENTS_API_KEY;

export async function GET(req) {
    try {
        const statusResp = await fetch('https://api.nowpayments.io/v1/status', {
            headers: { 'x-api-key': API_KEY }
        });
        const statusData = await statusResp.json();

        const currResp = await fetch('https://api.nowpayments.io/v1/currencies', {
            headers: { 'x-api-key': API_KEY }
        });
        const currencies = await currResp.json();

        return NextResponse.json({
            api_status: statusData,
            currencies: currencies
        });
    } catch (err) {
        console.error('Error fetching NOWPayments status / currencies', err);
        return NextResponse.json({ error: 'NOWPayments unavailable' }, { status: 500 });
    }
}