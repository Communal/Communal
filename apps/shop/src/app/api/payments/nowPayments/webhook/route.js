import { NextResponse } from 'next/server';
import Transaction from '@/db/schema/Transaction';
import User from '@/db/schema/User';
import crypto from 'crypto';
import connectDB from '@/config/db';

const IPN_KEY = process.env.NOWPAYMENTS_IPN_KEY;

function verifySignature(body, signatureHeader, IPNKEY) {
    if (!signatureHeader || !IPNKEY) return false;

    // Recursively sort JSON keys to create a consistent payload
    function sortObj(obj) {
        if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
        const sortedKeys = Object.keys(obj).sort();
        const result = {};
        for (const key of sortedKeys) {
            result[key] = sortObj(obj[key]);
        }
        return result;
    }

    const sorted = sortObj(body);
    const json = JSON.stringify(sorted);
    const hmac = crypto.createHmac('sha512', IPNKEY);
    hmac.update(json);
    const digest = hmac.digest('hex');
    return digest === signatureHeader;
}

export async function POST(req) {
    await connectDB();
    const raw = await req.text();
    const signature = req.headers.get('x-nowpayments-sig');

    let body;
    try {
        body = JSON.parse(raw);
    } catch (e) {
        console.error('Webhook: Invalid JSON', e);
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }

    const verified = verifySignature(body, signature, IPN_KEY);
    if (!verified) {
        console.error('Webhook: Signature mismatch');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { payment_status, order_id, outcome_amount } = body;
    if (!order_id) {
        console.error('Webhook: Missing order_id');
        return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    const tx = await Transaction.findOne({ reference: order_id });
    if (!tx) {
        console.error('Webhook: Transaction not found', order_id);
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Normalize payment status to match your schema
    let newStatus = 'PENDING';
    if (['waiting', 'pending', 'confirming'].includes(payment_status)) newStatus = 'PENDING';
    else if (['finished', 'confirmed'].includes(payment_status)) newStatus = 'SUCCESS';
    else if (['failed', 'expired'].includes(payment_status)) newStatus = 'FAILED';

    // Idempotency guard: don't process if already successful
    if (tx.status === 'SUCCESS' && newStatus === 'SUCCESS') {
        console.log(`Webhook: Transaction ${order_id} already SUCCESS — skipping duplicate.`);
        return NextResponse.json({ ok: true, message: 'Already processed' });
    }

    // Update transaction status if changed
    if (newStatus !== tx.status) {
        await Transaction.updateOne({ reference: order_id }, { status: newStatus });
    }

    // Update user balance only when moving into SUCCESS
    if (newStatus === 'SUCCESS' && tx.userId && tx.status !== 'SUCCESS') {
        const creditedAmount = Number(parseFloat(outcome_amount)) || 0;
        if (creditedAmount > 0) {
            await User.findByIdAndUpdate(tx.userId, {
                $inc: { balance: creditedAmount },
            });
            console.log(`Webhook: Credited user ${tx.userId} with ${creditedAmount} (outcome_amount).`);
        } else {
            console.warn(`Webhook: Invalid outcome_amount for ${order_id}:`, outcome_amount);
        }
    }

    return NextResponse.json({ ok: true });
}