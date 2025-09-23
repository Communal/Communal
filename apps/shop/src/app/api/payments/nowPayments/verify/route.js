import { NextResponse } from 'next/server';
import Transaction from '@/db/schema/Transaction';
import User from '@/db/schema/User';

const API_KEY = process.env.NOWPAYMENTS_API_KEY;

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const payment_id = searchParams.get('payment_id');
    const reference = searchParams.get('reference');

    if (!payment_id && !reference) {
        return NextResponse.json({ error: 'Missing payment_id or reference' }, { status: 400 });
    }

    try {
        const idForAPI = payment_id || reference;
        const resp = await fetch(`https://api.nowpayments.io/v1/payment/${idForAPI}`, {
            headers: { 'x-api-key': API_KEY }
        });
        const data = await resp.json();

        if (!resp.ok) {
            return NextResponse.json({ error: data }, { status: resp.status });
        }

        const tx = await Transaction.findOne({ reference: data.order_id });
        if (!tx) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        let newStatus = tx.status;
        const ps = data.payment_status;
        if (ps === 'waiting') newStatus = 'AWAITING_FUNDS';
        else if (ps === 'confirming') newStatus = 'CONFIRMING';
        else if (['finished', 'confirmed'].includes(ps)) newStatus = 'SUCCESS';
        else if (['failed', 'expired'].includes(ps)) newStatus = 'FAILED';

        if (newStatus !== tx.status) {
            await Transaction.updateOne({ reference: data.order_id }, { status: newStatus });
        }

        // Update user balance if payment succeeded
        if (newStatus === 'SUCCESS' && tx.userId) {
            await User.findByIdAndUpdate(tx.userId, {
                $inc: { balance: data.actually_paid }
            });
        }

        return NextResponse.json({ payment: data, status: newStatus });
    } catch (err) {
        console.error('Error verifying payment', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}