"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyContent() {
    const [status, setStatus] = useState("Verifying payment...");
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams?.get("reference");

    useEffect(() => {
        if (!reference) {
            setStatus("No transaction reference provided");
            setTimeout(() => router.replace("/"), 5000);
            return;
        }

        const verifyPayment = async () => {
            try {
                const res = await fetch("/api/payments/squad/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transaction_ref: reference }),
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus(data.message || "Payment verified successfully ✅");
                    setTimeout(() => router.replace("/"), 3000);
                } else {
                    setStatus(data.error || "Verification failed ❌");
                    setTimeout(() => router.replace("/"), 5000);
                }
            } catch (err) {
                setStatus("An error occurred ❌");
                setTimeout(() => router.replace("/"), 5000);
            }
        };

        verifyPayment();
    }, [reference, router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-xl font-bold text-orange-600">{status}</h1>
            <p className="mt-2 text-gray-500 text-sm">You will be redirected shortly...</p>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
