export const useSquad = (props) => {
  const handlePayment = (payload) => {
    if (window.squad) {
      const squadInstance = new window.squad({
        onClose: payload.onClose,
        onLoad: payload.onLoad,
        onSuccess: payload.onSuccess,
        key: process.env.NEXT_PUBLIC_SQUAD_PUB_KEY,
        email: payload.email,
        amount: payload.amount,
        currency_code: 'NGN',
        transaction_ref: payload.transaction_ref,
        customer_name: payload.customer_name,
        pass_charge: true,
      });
      squadInstance.setup();
      squadInstance.open();
    } else {
      alert('Network Error');
      if (props?.onScriptNotLoaded) props.onScriptNotLoaded();
    }
  };

  return handlePayment;
};
