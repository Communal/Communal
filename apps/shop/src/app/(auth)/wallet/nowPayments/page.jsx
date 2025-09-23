"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function StatusBadge({ status }) {
    let color = "bg-gray-200 text-gray-800";
    let label = status;

    if (status === "SUCCESS") {
        color = "bg-green-100 text-green-700 border border-green-300";
        label = "Payment Successful";
    } else if (status === "AWAITING_FUNDS" || status === "CONFIRMING") {
        color = "bg-yellow-100 text-yellow-700 border border-yellow-300";
        label = "Payment Pending";
    } else if (status === "FAILED") {
        color = "bg-red-100 text-red-700 border border-red-300";
        label = "Payment Failed";
    }

    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${color}`}
        >
            {label}
        </span>
    );
}

function VerifyPageContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const reference = searchParams.get("reference");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function verifyPayment() {
            if (!paymentId && !reference) {
                setError("Missing payment_id or reference in URL");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `/api/payments/nowPayments/verify?${paymentId ? `payment_id=${paymentId}` : `reference=${reference}`
                    }`
                );
                const result = await res.json();

                if (!res.ok) {
                    setError(result.error || "Verification failed");
                } else {
                    setData(result);
                }
            } catch (err) {
                console.error(err);
                setError("An error occurred while verifying payment");
            } finally {
                setLoading(false);
            }
        }

        verifyPayment();
    }, [paymentId, reference]);

    if (loading) return <p className="text-gray-500">Checking payment status...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Payment Verification</h1>

            {/* Status Badge */}
            {data?.status && (
                <div className="mb-4">
                    <StatusBadge status={data.status} />
                </div>
            )}

            {/* Raw JSON Debugging */}
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<p className="text-gray-500">Loading verification...</p>}>
            <VerifyPageContent />
        </Suspense>
    );
}