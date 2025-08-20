"use client";
import { useState } from "react";
import { XIcon, UserIcon, SearchIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { useAdminStore } from "@/store/adminStore";

export default function AdminHeader() {
  const { user, logout } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <header className="w-full bg-foreground px-4 pt-4 pb-2 fixed z-30 top-0">
      <div className="flex items-center justify-between gap-3">
        {/* Sidebar Menu */}
        <AdminSidebar />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Admin Info / Login */}
        {/* {user ? (
          <div className="flex items-center gap-4">
            <span className="bg-background text-foreground px-2 py-1 rounded font-medium text-[13px]">
              Admin: {user.firstName}
            </span>
          </div>
        ) : (
          <Link
            href="/admin/login"
            className="bg-background text-foreground px-3 py-1 rounded-full font-medium text-sm"
          >
            Login
          </Link>
        )} */}

        {/* User/Profile Icon */}
        {user && (
          <Link href="/admin/profile" className="flex items-center gap-1 text-background">
            <UserIcon className="size-6" />
          </Link>
        )}
      </div>

      {/* Search Bar */}
      {/* <form className="mt-4">
        <div className="flex items-center bg-[#ddd] rounded-xl px-4 py-2.5">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-lg text-gray-700 placeholder:text-gray-500"
            placeholder="Search admin tools…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="ml-2">
            <SearchIcon className="text-foreground size-5" />
          </button>
        </div>
      </form> */}

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer Content */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-foreground text-background p-8 flex flex-col justify-between transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
          <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
          <p className="text-lg">Manage products, users, and settings here.</p>
        </div>
        <div className="text-sm opacity-70 mt-8">
          &copy; {new Date().getFullYear()} Communal Shop Admin
        </div>
      </aside>
    </header>
  );
}