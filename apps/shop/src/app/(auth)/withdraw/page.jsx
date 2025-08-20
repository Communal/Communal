'use client';

import React, { useEffect, useState } from 'react';
import { Select } from '@/components/Select';
import Button from '@/components/Button';
import { useUserStore } from '@/store/userStore'; // adjust path
import BackHome from '@/components/Home';

export default function withdrawPage() {
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const { balance, fetchUser, hasHydrated, loading, user } = useUserStore();

  const withdrawOptions = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
  ];

  // Fetch user when hydrated and balance not loaded
  useEffect(() => {
    if (hasHydrated && !user && !loading) {
      fetchUser();
    }
  }, [hasHydrated, user, loading, fetchUser]);

  const handlewithdraw = () => {
    console.log('Selected Withdraw Method:', method);
    console.log('Entered Amount:', amount);
  };

  return (
    <div className="max-w-md mx-auto p-2 space-y-6">
      <BackHome/>
      {/* Account Balance */}
      <div>
        <div className="bg-gray-200 rounded-t-lg p-3 font-semibold text-orange-500">
          Account Balance
        </div>
        <div className="bg-orange-500 text-white text-3xl font-bold p-4 rounded-b-lg">
          {loading ? 'Loading...' : `₦${balance.toLocaleString()}`}
        </div>
      </div>

      {/* withdraw Method */}
      <div>
        <h2 className="mb-2 font-bold text-orange-500">Withdraw Method</h2>
        <Select
          options={withdrawOptions}
          value={method}
          onChange={(value) => setMethod(value)}
          placeholder="Click here to select withdraw method"
          className="bg-gray-200 rounded-lg"
        />
      </div>

      {/* Enter Amount */}
      <div>
        <h2 className="mb-2 font-bold text-orange-500">Enter Amount</h2>
        <div className="flex border-2 border-orange-500 rounded-lg overflow-hidden">
          <span className="bg-white flex items-center px-3 text-orange-500 font-bold">
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to withdraw"
            className="flex-1 p-3 outline-none"
          />
        </div>
      </div>

      {/* Make withdraw Button */}
      <Button
        onClick={handlewithdraw}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6 rounded-lg"
      >
        Make withdrawal
      </Button>
    </div>
  );
}
