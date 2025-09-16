import connectDB from '@/config/db';
import User from '@/db/schema/User';
import Transaction from '@/db/schema/Transaction';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { headers } from 'next/headers';
import Crypto from 'node:crypto';

export async function POST(req) {
  await connectDB();

  try {
    const reqHash = (await headers()).get('x-squad-encrypted-body');

    const body = await req.json();
    const { Event, Body, TransactionRef } = body;

    if (Event === 'charge_successful') {
      const bodyHash = Crypto.createHmac('sha512', process.env.SQUAD_SECRET_KEY)
        .update(JSON.stringify(body))
        .digest('hex')
        .toUpperCase();

      if (reqHash !== bodyHash) {
        throw new Error('Invalid call');
      }

      const existingTx = await Transaction.findOne({
        reference: Body.transaction_ref,
      });
      if (existingTx) {
        return NextResponse.json({
          status: true,
          message: 'Transaction already logged',
        });
      }

      const user = await User.findOne({ email: Body.email });
      if (!user) {
        return NextResponse.json(
          { status: false, message: 'User not found' },
          { status: 404 }
        );
      }

      if (Body.transaction_status.toLowerCase() === 'success') {
        const currentBalance = Number(user.balance) ?? 0;
        const newBalance = currentBalance + Number(Body.amount) / 100;

        user.balance = mongoose.Types.Decimal128.fromString(
          newBalance.toString()
        );
        await user.save();
      }

      const transaction = new Transaction({
        userId: user._id,
        reference: Body.transaction_ref,
        amount: Body.amount,
        type: 'CREDIT',
        status: Body.transaction_status.toUpperCase(),
        description: 'Wallet in',
      });
      await transaction.save();

      return NextResponse.json({ status: true, message: 'Success' });
    }
  } catch (err) {
    console.error('Webhook Error:', err);
    return NextResponse.json(
      { status: false, message: 'Server error', error: err.message },
      { status: 500 }
    );
  }
}
