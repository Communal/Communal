'use client';

import React, { useState } from 'react';
import { Select } from '@/components/Select';
import Button from '@/components/Button';
import { useUserStore } from '@/store/userStore';
import BackHome from '@/components/Home';
import { useSquad } from '../../api/payments/squad/client';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [message, setMessage] = useState('');
  const [checkoutURL, setCheckoutURL] = useState(null);
  const { balance, loading, user } = useUserStore();

  const paymentOptions = [
    { value: 'squad', label: 'Squad - Card, Bank Transfer' },
    { value: 'cryptomus', label: 'Cryptomus - USDT' },
  ];

  const squad = useSquad();

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
      let url = '';
      let body = {};

      if (method.includes('squad')) {
        squad({
          amount: Number(amount) * 100,
          email: user.email,
          transaction_ref: `user_${user._id}_${Date.now()}`,
          customer_name: `${user.firstName} ${user.lastName}`,
          callbackUrl: location.href,
          onClose: () => { },
          onSuccess: () => {
            alert('Transaction Successful');
            router.replace('/');
          },
        });
        return;
      } else if (method === 'cryptomus') {
        url = '/api/payments/cryptomus/in';
        body = {
          amount: parseFloat(amount),
          currency: 'USDT',
          userId: user._id,
          orderId: `user_${user._id}_${Date.now()}`,
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');

      // Korapay returns checkout_url, Cryptomus returns result.url
      const checkout = data.data?.checkout_url || data.result?.url || null;

      if (!checkout) throw new Error('No checkout URL returned');

      setCheckoutURL(checkout);
      setMessage('');
    } catch (err) {
      setMessage(err.message || 'Error creating payment');
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className='max-w-md mx-auto p-2 space-y-6'>
      <Script
        src='https://checkout.squadco.com/widget/squad.min.js'
        strategy='lazyOnload'
      />
      <BackHome />

      {/* Account Balance */}
      <div>
        <div className='bg-gray-200 rounded-t-lg p-3 font-semibold text-orange-500'>
          Account Balance
        </div>
        <div className='bg-orange-500 text-white text-3xl font-bold p-4 rounded-b-lg'>
          {loading ? 'Loading...' : `₦${balance.toLocaleString()}`}
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h2 className='mb-2 font-bold text-orange-500'>Payment Method</h2>
        <Select
          options={paymentOptions}
          value={method}
          onChange={(value) => setMethod(value)}
          placeholder='Click here to select payment method'
          className='bg-gray-200 rounded-lg'
        />
      </div>

      {/* Amount */}
      <div>
        <h2 className='mb-2 font-bold text-orange-500'>Enter Amount</h2>
        <div className='flex border-2 border-orange-500 rounded-lg overflow-hidden'>
          <span className='bg-white flex items-center px-3 text-orange-500 font-bold'>
            ₦
          </span>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='Enter amount to deposit'
            className='flex-1 p-3 outline-none'
          />
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-center ${message.toLowerCase().includes('success')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
            }`}>
          {message}
        </div>
      )}

      {/* Make Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={loadingPayment}
        className='w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6 rounded-lg'>
        {loadingPayment ? 'Processing...' : 'Make Payment'}
      </Button>

      {/* Modal with Iframe */}
      {checkoutURL && (
        <div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg w-full max-w-lg h-[80vh] flex flex-col'>
            <div className='flex justify-between items-center p-4 border-b'>
              <h2 className='font-bold text-orange-500'>Complete Payment</h2>
              <button
                onClick={() => setCheckoutURL(null)}
                className='text-red-500 font-bold'>
                ✕
              </button>
            </div>
            <iframe
              src={checkoutURL}
              className='flex-1 w-full border-0'
              title='Payment Checkout'></iframe>
          </div>
        </div>
      )}
    </div>
  );
}