"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Trash2, ChevronRight } from "lucide-react"
import ConfirmModal from "./ConfirmModal"
import Image from "next/image"

export default function PlatformItem({ id, name, logo, onDelete }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const handleDelete = () => {
    onDelete?.(id)
    setShowModal(false)
  }

  return (
    <>
      {/* Card with clear visual separation */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 mb-3 shadow-md border border-gray-200">
        {/* Left side - orange platform link area */}
        <div
          onClick={() => router.push(`/sub-category/${id}`)}
          className="flex items-center gap-3  cursor-pointer flex-1 group"
        >
          <div className="p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
            <Image
              width={40}
              height={40}
              src={logo || "/icons/default-image.png"}
              alt={name}
              className="size-8 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <span className="text-foreground font-semibold group-hover:text-orange-800 transition-colors">
              {name}
            </span>
          </div>
        </div>

        {/* Right side controls with clear separation */}
        <div className="flex items-center gap-3 ml-4">
          {/* Chevron - navigates with orange theme */}
          <div
            onClick={() => router.push(`/sub-category/${id}`)}
            className="p-2 rounded-lg cursor-pointer hover:bg-orange-200 transition-colors group/chevron"
          >
            <ChevronRight className="text-foreground size-5 group-hover/chevron:text-orange-700" />
          </div>

          {/* Delete button - standalone red button */}
          <div className="h-8 w-px bg-gray-300 mx-1" /> {/* Separator line */}

          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowModal(true)
            }}
            className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors group/delete"
            aria-label={`Delete ${name}`}
          >
            <Trash2 className="text-red-600 size-4 group-hover/delete:text-red-700" />
          </button>
        </div>
      </div>

      {/* Custom confirmation modal */}
      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Delete Platform"
        message={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  )
}