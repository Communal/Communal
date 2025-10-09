import { NextResponse } from 'next/server';
import Transaction from '@/db/schema/Transaction';
import User from '@/db/schema/User';
import connectDB from '@/config/db';

const API_KEY = process.env.NOWPAYMENTS_API_KEY;

export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const payment_id = searchParams.get('payment_id');
    const reference = searchParams.get('reference');

    if (!payment_id && !reference) {
        return NextResponse.json({ error: 'Missing payment_id or reference' }, { status: 400 });
    }

    try {
        const idForAPI = payment_id || reference;
        const resp = await fetch(`https://api.nowpayments.io/v1/payment/${idForAPI}`, {
            headers: { 'x-api-key': API_KEY },
        });
        const data = await resp.json();

        if (!resp.ok) {
            return NextResponse.json({ error: data }, { status: resp.status });
        }

        const tx = await Transaction.findOne({ reference: data.order_id });
        if (!tx) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // Normalize payment status
        let newStatus = 'PENDING';
        const ps = data.payment_status;
        if (['waiting', 'pending', 'confirming'].includes(ps)) newStatus = 'PENDING';
        else if (['finished', 'confirmed'].includes(ps)) newStatus = 'SUCCESS';
        else if (['failed', 'expired'].includes(ps)) newStatus = 'FAILED';

        // Idempotency guard
        if (tx.status === 'SUCCESS' && newStatus === 'SUCCESS') {
            console.log(`Verify: Transaction ${tx.reference} already SUCCESS — skipping re-credit.`);
            return NextResponse.json({ payment: data, status: tx.status });
        }

        // Update transaction status if changed
        if (newStatus !== tx.status) {
            await Transaction.updateOne({ reference: data.order_id }, { status: newStatus });
        }

        // Credit user once, using outcome_amount
        if (newStatus === 'SUCCESS' && tx.userId && tx.status !== 'SUCCESS') {
            const creditedAmount = Number(parseFloat(data.outcome_amount)) || 0;
            if (creditedAmount > 0) {
                await User.findByIdAndUpdate(tx.userId, {
                    $inc: { balance: creditedAmount },
                });
                console.log(`Verify: Credited user ${tx.userId} with ${creditedAmount} (outcome_amount).`);
            } else {
                console.warn(`Verify: Invalid outcome_amount:`, data.outcome_amount);
            }
        }

        return NextResponse.json({ payment: data, status: newStatus });
    } catch (err) {
        console.error('Error verifying payment', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}