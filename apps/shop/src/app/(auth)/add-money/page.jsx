"use client";

import React, { useState } from "react";
import { Select } from "@/components/Select";
import Button from "@/components/Button";
import { useUserStore } from "@/store/userStore";
import BackHome from "@/components/Home";

export default function PaymentPage() {
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [message, setMessage] = useState("");
  const { balance, fetchUser, hasHydrated, loading, user } = useUserStore();

  const paymentOptions = [
    { value: "card", label: "Credit/Debit Card" },
    { value: "bank", label: "Bank Transfer" },
  ];

  const loadKorapayAndPay = () => {
    return new Promise((resolve, reject) => {
      if (window.Korapay) {
        resolve(window.Korapay);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.korapay.com/korapay.js";
      script.async = true;

      script.onload = () => resolve(window.Korapay);
      script.onerror = () => reject(new Error("Failed to load Korapay SDK"));

      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!method || !amount) {
      setMessage("Please select a payment method and enter an amount.");
      return;
    }

    setLoadingPayment(true);
    setMessage("Opening checkout...");

    try {
      const Korapay = await loadKorapayAndPay();

      Korapay.initialize({
        key: process.env.NEXT_PUBLIC_KORAPAY_PUBLIC_KEY,
        reference: `ref_${Date.now()}`,
        amount: parseFloat(amount),
        currency: "NGN",
        customer: {
          name: user?.name || "Anonymous User",
          email: user?.email || "test@example.com",
        },
        notification_url: `${process.env.NEXT_PUBLIC_API_URL}/api/webhook/korapay`,
        onClose: () => {
          setMessage("Payment closed before completion.");
          setLoadingPayment(false);
        },
        onSuccess: () => {
          setMessage("Payment successful! Updating balance...");
          fetchUser();
          setLoadingPayment(false);
        },
        onError: (err) => {
          setMessage("Payment failed: " + (err?.message || "Unknown error"));
          setLoadingPayment(false);
        },
      });
    } catch (error) {
      setMessage(error.message);
      setLoadingPayment(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-2 space-y-6">
      <BackHome />

      {/* Balance */}
      <div>
        <div className="bg-gray-200 rounded-t-lg p-3 font-semibold text-orange-500">
          Account Balance
        </div>
        <div className="bg-orange-500 text-white text-3xl font-bold p-4 rounded-b-lg">
          {loading ? "Loading..." : `₦${balance.toLocaleString()}`}
        </div>
      </div>

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
          <span className="bg-white flex items-center px-3 text-orange-500 font-bold">
            ₦
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to deposit"
            className="flex-1 p-3 outline-none"
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-center ${message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {message}
        </div>
      )}

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        disabled={loadingPayment}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6 rounded-lg"
      >
        {loadingPayment ? "Opening Checkout..." : "Make Payment"}
      </Button>
    </div>
  );
}
