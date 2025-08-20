import React from "react";
import Button from "./Button";

const PurchaseCard = ({ purchase }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      <div className="text-foreground bg-[#E0E0E0] p-2">{purchase?.name}</div>

      <div className="bg-foreground text-background p-2">
        <div>{purchase?.info}</div>
        <div>Price: {purchase?.priceAtPurchase}</div>
      </div>

      <div className="text-foreground bg-[#E0E0E0] flex justify-between items-center p-2">
        <p className="text-l">
          {new Date(purchase.purchaseDate).toLocaleDateString()}
        </p>
        <Button className="bg-foreground px-2 text-l">Click here to view Product</Button>
      </div>
    </div>
  );
};

export default PurchaseCard;
