"use client";
import { useState } from "react";

export default function PaymentModal({ amount, onConfirm, onCancel, error }) { // 1. Add error prop
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        await onConfirm(password);
        setLoading(false);
    };

    return (
        <div className="fixed text-foreground inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
                <p className="mb-2">You are about to pay:</p>
                <p className="font-bold text-lg mb-4">${amount}</p>

                {/* 2. Display the error message if it exists */}
                {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border p-2 rounded mb-4 ${error ? "border-red-500" : "border-gray-300"}`}
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !password}
                        className="px-4 py-2 rounded bg-orange-500 text-white disabled:opacity-50 hover:bg-orange-600 transition"
                    >
                        {loading ? "Processing..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}