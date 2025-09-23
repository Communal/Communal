"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Verify token on page load
    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch("/api/auth/verify-token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();
                if (data.valid) {
                    setValid(true);
                    setMessage("Token verified. Enter your new password.");
                } else {
                    setMessage(data.error || "Invalid or expired token.");
                }
            } catch (err) {
                setMessage("Error verifying token.");
            } finally {
                setLoading(false);
            }
        };

        if (token) verify();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Updating password...");
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Password reset successful. Redirecting to login...");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setMessage(data.error || "Error resetting password.");
            }
        } catch (err) {
            setMessage("Something went wrong.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-orange-500">Reset Password</h1>

            {loading ? (
                <p>Verifying token...</p>
            ) : valid ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full border p-3 rounded-lg"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                    >
                        Reset Password
                    </button>
                </form>
            ) : (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg">{message}</div>
            )}

            {message && valid && (
                <div className="mt-4 p-3 rounded-lg bg-gray-100 text-gray-800 text-center">
                    {message}
                </div>
            )}
        </div>
    );
}
