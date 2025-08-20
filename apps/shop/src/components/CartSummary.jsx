import Button from "./Button";

export default function CartSummary ({ totalAmount, totalItems }) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-orange-500 text-white p-4 shadow-lg z-50">
      <h3 className="text-xl font-bold mb-3">Cart Summary</h3>

      <div className="flex justify-between border-b border-white/40 pb-2 mb-2">
        <span>Total Price in USD :</span>
        <span className="font-bold">${totalAmount.toLocaleString()}</span>
      </div>

      <div className="flex justify-between border-b border-white/40 pb-2 mb-2">
        <span>Total Number of items :</span>
        <span className="font-bold">{totalItems}</span>
      </div>

      <div className="flex justify-between mb-4">
        <span>You Pay :</span>
        <span className="font-bold">${totalAmount.toLocaleString()}</span>
      </div>

      <Button className="w-full bg-white text-orange-500 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors">
        Proceed with payment
      </Button>
    </div>
  );
};
