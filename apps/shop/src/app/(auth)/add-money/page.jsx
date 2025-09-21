'use client';

import React, { useState } from 'react';
import { Select } from '@/components/Select';
import Button from '@/components/Button';
import { useUserStore } from '@/store/userStore';
import BackHome from '@/components/Home';
import { useSquad } from '@/hooks/useSquad';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [message, setMessage] = useState('');
  // const [checkoutURL, setCheckoutURL] = useState(null);

  const { balance, loading, user } = useUserStore();
  const squad = useSquad();

  const paymentOptions = [
    { value: 'squad', label: 'Squad - Card, Bank Transfer' },
    { value: 'cryptomus', label: 'Cryptomus - USDT' },
    { value: 'nowpayments', label: 'NOWPayments - Crypto' },
  ];

  const handlePayment = async () => {
    if (!method || !amount) {
      setMessage('Please select a payment method and enter an amount.');
      return;
    }
    if (!user?._id) {
      setMessage('You must be logged in to make a payment.');
      return;
    }

    setLoadingPayment(true);
    setMessage('Creating payment...');

    try {
      if (method === 'squad') {
        const res = await fetch('/api/payments/squad/in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            amount: parseFloat(amount),
            email: user.email,
            customer_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            description: 'Wallet in',
          }),
        });

        const json = await res.json();
        if (!res.ok || !json?.status) throw new Error(json?.message || 'Failed');

        const { transaction_ref, amount_kobo } = json.data;

        squad({
          amount: amount_kobo,
          email: user.email,
          transaction_ref,
          customer_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          callbackUrl: window.location.href,
          onLoad: () => {
            setMessage('');
            setLoadingPayment(false);
          },
          onClose: () => {
            setMessage('Payment modal closed.');
            setLoadingPayment(false);
          },
          onSuccess: () => {
            setMessage('Transaction successful (awaiting verification).');
            router.replace('/');
          },
        });
        return;
      }

      if (method === 'cryptomus') {
        const res = await fetch('/api/payments/cryptomus/in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            amount: parseFloat(amount),
            currency: 'USDT',
            orderId: `user_${user._id}_${Date.now()}`,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Payment failed');

        const checkout = data.data?.checkout_url || data.result?.url || null;
        if (!checkout) throw new Error('No checkout URL returned');
        setCheckoutURL(checkout);
        setMessage('');
        return;
      }

      if (method === 'nowpayments') {
        const res = await fetch('/api/payments/nowPayments/in/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            amount: parseFloat(amount),
            pay_currency: 'usd', // ✅ always pass fixed value
            description: 'Wallet in',
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Payment failed');

        const checkout = data.invoice?.invoice_url || null;
        if (!checkout) throw new Error('No invoice URL returned');

        // setCheckoutURL(checkout);
        router.push(checkout);

        setMessage('');
        return;
      }
    } catch (err) {
      setMessage(err.message || 'Error creating payment');
      setLoadingPayment(false);
    } finally {
      if (method !== 'squad') setLoadingPayment(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-2 space-y-6">
      <Script src="https://checkout.squadco.com/widget/squad.min.js" strategy="lazyOnload" />
      <BackHome />

      {/* Account Balance */}
      <div>
        <div className="bg-gray-200 rounded-t-lg p-3 font-semibold text-orange-500">
          Account Balance
        </div>
        <div className="bg-orange-500 text-white text-3xl font-bold p-4 rounded-b-lg">
          {loading ? 'Loading...' : `₦${Number(balance || 0).toLocaleString()}`}
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h2 className="mb-2 font-bold text-orange-500">Payment Method</h2>
        <Select
          options={paymentOptions}
          value={method}
          onChange={(value) => setMethod(value)}
          placeholder="Click here to select payment method"
          className="bg-gray-200 rounded-lg"
        />
      </div>

      {/* Amount */}
      <div>
        <h2 className="mb-2 font-bold text-orange-500">Enter Amount</h2>
        <div className="flex border-2 border-orange-500 rounded-lg overflow-hidden">
          <span className="bg-white flex items-center px-3 text-orange-500 font-bold">₦</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to deposit"
            className="flex-1 p-3 outline-none"
          />
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-center ${message.toLowerCase().includes('success')
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
            }`}
        >
          {message}
        </div>
      )}

      {/* Make Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={loadingPayment}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6 rounded-lg"
      >
        {loadingPayment ? 'Processing...' : 'Make Payment'}
      </Button>

      {/* Modal with Iframe (for Cryptomus/NOWPayments) */}
      {/* {checkoutURL && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold text-orange-500">Complete Payment</h2>
              <button
                onClick={() => setCheckoutURL(null)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
            <iframe
              src={checkoutURL}
              className="flex-1 w-full border-0"
              title="Payment Checkout"
            ></iframe>
          </div>
        </div>
      )} */}
    </div>
  );
}
