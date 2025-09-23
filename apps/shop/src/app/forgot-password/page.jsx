"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            setMessage(data.message || data.error);
        } catch (err) {
            setMessage("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-orange-500">Forgot Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full border p-3 rounded-lg"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>

            {message && (
                <div className="mt-4 p-3 rounded-lg bg-gray-100 text-gray-800 text-center">
                    {message}
                </div>
            )}
        </div>
    );
}
