"use client";
import { useState } from "react";
import { XIcon, UserIcon, ShoppingCartIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import SidebarDrawer from "./SidebarDrawer";
import { useUser } from "../app/api/useUser";
import { useCartStore } from "../store/cart";

export default function Header() {
  const { user } = useUser();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const cartItems = useCartStore((state) => state.items);

  return (
    <header className="w-full bg-foreground px-4 pt-4 pb-2 fixed z-30 top-0">
      <div className="flex items-center justify-between gap-3">
        {/* Sidebar Menu */}
        <SidebarDrawer />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Account Balance / Login Button */}
        {user ? (
          <div className="bg-background text-foreground px-2 py-1 rounded font-medium text-[13px] flex items-center">
            Account Balance: ₦
            {Number(user.balance?.$numberDecimal || 0).toLocaleString()}
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-background text-foreground px-3 py-1 rounded-full font-medium text-sm"
          >
            Login
          </Link>
        )}

        {/* User Icon (Only if logged in) */}
        {user && (
          <Link href="/profile" className="flex items-center gap-1 text-background">
            <UserIcon className="size-6" />
          </Link>
        )}

        {/* Cart */}
        <Link href="/cart" className="ml-4 relative">
          {(cartItems ?? []).length > 0 && (
            <span className="absolute z-10 bg-red-500 text-white size-5 rounded-full flex items-center justify-center -left-2 -top-1 text-sm font-semibold">
              {cartItems.length}
            </span>
          )}
          <ShoppingCartIcon className="text-background size-7" />
        </Link>
      </div>

      {/* Search Bar */}
      <form className="mt-4">
        <div className="flex items-center bg-[#ddd] rounded-xl px-4 py-2.5">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-lg text-gray-700 placeholder:text-gray-500"
            placeholder="What do you want to buy ?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="ml-2">
            <SearchIcon className="text-foreground size-5" />
          </button>
        </div>
      </form>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer Content */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-foreground text-background p-8 flex flex-col justify-between transform transition-transform duration-300 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-hidden={!sidebarOpen}
      >
        <button
          className="absolute top-4 right-4"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        >
          <XIcon className="text-background size-7" />
        </button>
        <div>
          <h2 className="text-3xl font-bold mb-4">Welcome to Communal Shop</h2>
          <p className="text-lg">
            Shop together, save together. Join our community and enjoy exclusive
            deals!
          </p>
        </div>
        <div className="text-sm opacity-70 mt-8">
          &copy; {new Date().getFullYear()} Communal Shop
        </div>
      </aside>
    </header>
  );
}
