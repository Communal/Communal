// hooks/useSquad.js
export const useSquad = () => {
    const handlePayment = (payload) => {
        if (typeof window === "undefined") return;

        if (window.squad) {
            const squadInstance = new window.squad({
                onClose: payload.onClose,
                onLoad: payload.onLoad,
                onSuccess: payload.onSuccess,
                key: process.env.NEXT_PUBLIC_SQUAD_PUB_KEY,
                email: payload.email,
                amount: payload.amount, // kobo (integer)
                currency_code: "NGN",
                transaction_ref: payload.transaction_ref,
                customer_name: payload.customer_name,
                pass_charge: true,
            });
            squadInstance.setup();
            squadInstance.open();
        } else {
            alert("Payment script not loaded (network or script error)");
            if (payload?.onScriptNotLoaded) payload.onScriptNotLoaded();
        }
    };

    return handlePayment;
};