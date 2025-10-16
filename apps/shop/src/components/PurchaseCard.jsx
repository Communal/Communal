import React from "react";
import Button from "./Button";

const PurchaseCard = ({ purchase, onViewDetails }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      {/* Product Name */}
      <div className="text-foreground bg-[#E0E0E0] p-2 font-semibold">
        {purchase?.name}
      </div>
      <div className="bg-foreground text-background p-2 space-y-1">
        <div>{purchase?.info}</div>
        <div>Price: ${purchase?.priceAtPurchase}</div>
      </div>

      {/* Footer */}
      <div className="text-foreground bg-[#E0E0E0] flex justify-between items-center p-2">
        <p className="text-l">
          {new Date(purchase.purchaseDate).toLocaleDateString()}
        </p>

        <Button
          onClick={() => onViewDetails?.(purchase)}
          className="bg-foreground px-2 text-l hover:opacity-90 transition"
        >
          View Product
        </Button>
      </div>
    </div>
  );
};

export default PurchaseCard;
