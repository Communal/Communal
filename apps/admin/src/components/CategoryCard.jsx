"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

export default function CategoryItem({ id, name, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    onDelete?.(id);
    setShowModal(false);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-white rounded-xl p-4 mb-3 shadow-md border border-gray-200">
        {/* Left side - just the category name */}
        <div className="flex-1">
          <span className="text-foreground font-semibold">{name}</span>
        </div>

        {/* Right side - delete button only */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
            aria-label={`Delete ${name}`}
          >
            <Trash2 className="text-red-600 size-4 hover:text-red-700" />
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
