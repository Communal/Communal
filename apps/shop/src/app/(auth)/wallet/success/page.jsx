"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import BackHome from "@/components/Home";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { user, fetchUser } = useUserStore();
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/payments/korapay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference, userId: user?._id }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setStatus("✅ Payment successful! Balance updated.");
          fetchUser();
        } else {
          setStatus("❌ " + (data.error || "Payment verification failed"));
        }
      } catch (err) {
        setStatus("❌ Error verifying payment");
      }
    };

    if (reference && user?._id) {
      verifyPayment();
    }
  }, [reference, user]);

  return (
    <div className="max-w-md mx-auto p-4 text-center space-y-6">
      <BackHome />
      <h1 className="text-2xl font-bold text-orange-500">Payment Status</h1>
      <p className="text-lg">{status}</p>
    </div>
  );
}
