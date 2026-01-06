"use client";
import { useState } from "react";
import PaymentModal from "@/components/PaymentModal";
import { useCartStore } from "@/store/cart";

export default function usePaymentFlow() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [amount, setAmount] = useState(0);
    const [productIds, setProductIds] = useState([]);
    const [onSuccess, setOnSuccess] = useState(null);
    const [error, setError] = useState(null);

    const clearCart = useCartStore((state) => state.clearCart);

    const startPayment = ({ products, totalAmount, callback }) => {
        setError(null); // Reset error when opening fresh
        setProductIds(products.map((p) => p._id));
        setAmount(totalAmount);
        setOnSuccess(() => callback);
        setModalOpen(true);
    };

    const handleConfirm = async (password) => {
        setError(null); // 1. Clear previous errors before new attempt
        try {
            const res = await fetch("/api/wallet/withdraw", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    productIds,
                    amount,
                    password,
                }),
            });

            const data = await res.json();

            // The backend returns { error: "Invalid password" } or { error: "Insufficient funds" }
            if (!res.ok) throw new Error(data.error || "Payment failed");

            clearCart();
            if (onSuccess) onSuccess(data);
            setModalOpen(false);
            return true;
        } catch (err) {
            setError(err.message); // 2. This now gets passed to the modal
            return false;
        }
    };

    const handleCancel = () => {
        setModalOpen(false);
        setError(null);
    };

    const PaymentUI = () =>
        isModalOpen && (
            <PaymentModal
                amount={amount}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                error={error}
            />
        );

    return {
        startPayment,
        PaymentUI,
        error,
    };
}