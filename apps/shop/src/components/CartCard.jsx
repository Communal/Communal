"use client";

import { Trash2 } from "lucide-react";
import Button from "@/components/Button";

export default function CartProductCard({ item, removeItem }) {
  return (
    <div className="w-full max-w-2xl rounded-2xl bg-background-2 shadow-md flex flex-col gap-0.5 mb-6">
      {/* Header */}
      <div className="flex text-base items-center justify-between px-3 py-2 pb-1">
        <div className="flex items-center gap-2">
          {/* Optional: if you have an icon field for the cart items */}
          {item?.icon}
          <span className="text-md font-bold text-foreground">
            {item?.name || "Product"}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-foreground text-white px-3 py-3 text-xs font-medium rounded-t-none rounded-b-none">
        {item?.info}
      </div>

      {/* Price Section */}
      <div className="bg-foreground px-2 py-2 text-base flex flex-col gap-2">
        <div className="flex items-center justify-between mt-1">
          <span className="font-semibold  text-neutral-100">
            Price in USD :
          </span>
          <span className="bg-[#e6e6e6] text-foreground font-bold text-lg px-6 py-1 rounded-xl border-2 border-white">
            ${item?.price}
          </span>
        </div>
      </div>

      {/* Action Section */}
      <div className="flex items-center justify-between px-3 py-2">
        <Button
          onClick={removeItem}
          className="bg-foreground text-white flex items-center gap-1"
        >
          <Trash2 />
          Remove
        </Button>
      </div>
    </div>
  );
}
