import { NextResponse } from 'next/server';
import Transaction from '@/db/schema/Transaction';
import User from '@/db/schema/User';
import crypto from 'crypto';

const IPN_KEY = process.env.NOWPAYMENTS_IPN_KEY;

function verifySignature(body, signatureHeader, ipnSecret) {
    if (!signatureHeader) return false;

    // Recursively sort JSON keys
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
    const hmac = crypto.createHmac('sha512', ipnSecret);
    hmac.update(json);
    const digest = hmac.digest('hex');
    return digest === signatureHeader;
}

export async function POST(req) {
    const raw = await req.text();
    const signature = req.headers.get('x-nowpayments-sig');

    let body;
    try {
        body = JSON.parse(raw);
    } catch (e) {
        console.error('Webhook: Invalid JSON', e);
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }

    const verified = verifySignature(body, signature, IPN_SECRET);
    // if (!verified) {
    //     console.error('Webhook: Signature mismatch');
    //     return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    // }

    const { payment_status, order_id, actually_paid } = body;
    if (!order_id) {
        console.error('Webhook: Missing order_id');
        return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    const tx = await Transaction.findOne({ reference: order_id });
    if (!tx) {
        console.error('Webhook: Transaction not found', order_id);
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let newStatus = tx.status;
    if (['waiting', 'pending'].includes(payment_status)) newStatus = 'AWAITING_FUNDS';
    else if (payment_status === 'confirming') newStatus = 'CONFIRMING';
    else if (['finished', 'confirmed'].includes(payment_status)) newStatus = 'SUCCESS';
    else if (['failed', 'expired'].includes(payment_status)) newStatus = 'FAILED';

    if (newStatus !== tx.status) {
        await Transaction.updateOne({ reference: order_id }, { status: newStatus });
    }

    // Update user balance if payment succeeded
    if (newStatus === 'SUCCESS' && tx.userId) {
        await User.findByIdAndUpdate(tx.userId, {
            $inc: { balance: actually_paid } // assuming price_currency is USD
        });
    }

    return NextResponse.json({ ok: true });
}
