import React from "react";
import Button from "./Button";
import { Trash2 } from "lucide-react";
import { useCartStore } from "../store/cart";
import { products } from "../data/Products";

const CartProductCard = ({ item }) => {
  const { removeItem } = useCartStore();

  // Find the product details
  const product = products.find((p) => p.id === item.id);

  const handleRemove = () => {
    removeItem(item.id);
  };

  if (!product) return null; // fallback if product not found

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-background-2 shadow-md py-2 flex flex-col gap-0.5 mb-6">
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <div className="flex items-center gap-2">
          <span>{item.icon}</span>
          <span className="text-xl font-bold text-foreground">
            {product.name}
          </span>
        </div>
        <Button>View Sample</Button>
      </div>

      <div className="bg-foreground text-white px-3 py-3 text-base font-medium rounded-t-none rounded-b-none">
        {product.info}
      </div>

      <div className="bg-foreground px-3 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg text-neutral-100">
            Category ID:
          </span>
          <span className="bg-[#e6e6e6] text-foreground font-bold text-lg px-6 py-1 rounded-xl border-2 border-white">
            {product.category.toString()}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-semibold text-lg text-neutral-100">
            Price in USD :
          </span>
          <span className="bg-[#e6e6e6] text-foreground font-bold text-lg px-6 py-1 rounded-xl border-2 border-white">
            ${product.price ?? 0}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-semibold text-lg text-neutral-100">
            Sold Status:
          </span>
          <span className="bg-[#e6e6e6] text-foreground font-bold text-lg px-6 py-1 rounded-xl border-2 border-white">
            {product.isSold ? "Sold" : "Available"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-3">
        <Button
          className="bg-foreground text-white font-semibold rounded-xl px-5 py-2 text-lg flex items-center gap-2"
          onClick={handleRemove}
        >
          <Trash2 className="mr-1" /> Remove
        </Button>
      </div>
    </div>
  );
};

export default CartProductCard;
