import { NextResponse } from 'next/server';

const API_KEY = process.env.NOWPAYMENTS_API_KEY;

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const currency_from = searchParams.get('currency_from');
    const currency_to = searchParams.get('currency_to');
    if (!currency_from || !currency_to) {
        return NextResponse.json({ error: 'Missing currency_from or currency_to' }, { status: 400 });
    }
    try {
        const resp = await fetch(`https://api.nowpayments.io/v1/minimum-amount?currency_from=${currency_from}&currency_to=${currency_to}&is_fee_paid_by_user=False`, {
            headers: { 'x-api-key': API_KEY }
        });
        const data = await resp.json();
        return NextResponse.json({ minimum: data });
    } catch (err) {
        console.error('Error fetching min amount', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}