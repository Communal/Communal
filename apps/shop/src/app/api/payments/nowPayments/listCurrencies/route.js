import { NextResponse } from 'next/server';

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;

export async function GET() {
    try {
        const res = await fetch('https://api.nowpayments.io/v1/merchant/coins', {
            headers: {
                'x-api-key': NOWPAYMENTS_API_KEY,
                accept: 'application/json',
            },
        });

        const data = await res.json();

        return NextResponse.json({
            selectedCurrencies: data?.selectedCurrencies || [],
        });
    } catch (err) {
        console.error('Currencies fetch error:', err);
        return NextResponse.json(
            { error: 'Failed to fetch currencies', selectedCurrencies: [] },
            { status: 500 }
        );
    }
}
