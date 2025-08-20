import React from "react";
import Button from "./Button";

export default function ConfirmDialog({ isOpen, body, onClose, buttons = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        {/* Heading */}
        <h2 className="text-lg font-bold mb-4">Confirm Action</h2>

        {/* Body */}
        <p className="mb-6 text-gray-700">{body}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              onClick={btn.onClick}
              variant={btn.variant || "default"}
              size={btn.size || "base"}
              disabled={btn.disabled}
              className={btn.className}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
