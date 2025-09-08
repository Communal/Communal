"use client";
import { Suspense } from "react";
import PaymentSuccessInner from "./PaymentSuccessInner";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <PaymentSuccessInner />
    </Suspense>
  );
}