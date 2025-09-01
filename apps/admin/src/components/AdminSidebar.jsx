"use client";
import { useState } from "react";
import {
  Menu as MenuIcon,
  X as XIcon,
  Home as HomeIcon,
  User as UserIcon,
  Package as ProductsIcon,
  ShoppingCart as OrdersIcon,
  Settings as SettingsIcon,
  ChevronRightIcon,
  Send as SendIcon,
  LogOut as LogOutIcon,
} from "lucide-react";
import Button from "@/components/Button";
import Link from "next/link";
import ConfirmDialog from "@/components/DialogBox";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { SquareMenu } from "lucide-react";
import { FileClock } from "lucide-react";
import { BadgeDollarSign } from "lucide-react";

export default function AdminSidebar() {
  const { user, logout } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setShowLogoutDialog(false);
    router.push("/admin/login");
  };

  return (
    <>
      {/* Open button */}
      <button aria-label="Open sidebar" onClick={() => setOpen(true)}>
        <MenuIcon className="text-background size-7" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-full sm:w-4/5 max-w-xs bg-foreground pb-10 text-background p-4 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-hidden={!open}
      >
        <button
          className="absolute top-4 right-4"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
        >
          <XIcon className="text-background size-7" />
        </button>

        {/* Admin Info Card */}
        <div className="overflow-hidden mt-4 mb-8">
          <span className="font-semibold text-xl text-white">
            {user ? (
              <span>{user.firstName}</span>
            ) : (
              <span>Loading user...</span>
            )}


          </span>
          {/* <div className="text-md font-medium px-5 py-3">
            {user ? `Role: ${user.role}` : "Not authenticated"}
          </div> */}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto hide-scrollbar">
          <SidebarLink
            href="/"
            icon={<HomeIcon className="size-6" />}
            label="Dashboard"
            onClick={() => setOpen(false)}
          />
          <SidebarLink
            href="/category-manager"
            icon={<SquareMenu className="size-6" />}
            label="Category Manager"
            onClick={() => setOpen(false)}
          />
          <SidebarLink
            href="/add-product"
            icon={<ProductsIcon className="size-6" />}
            label="Add Product"
            onClick={() => setOpen(false)}
          />
          <SidebarLink
            href="/orders"
            icon={<FileClock className="size-6" />}
            label="Orders and Stock"
            onClick={() => setOpen(false)}
          />
          <SidebarLink
            href="/transaction-history"
            icon={<BadgeDollarSign className="size-6" />}
            label="Transaction History"
            onClick={() => setOpen(false)}
          />
          <SidebarLink
            href="/settings"
            icon={<SettingsIcon className="size-6" />}
            label="Settings"
            onClick={() => setOpen(false)}
          />
        </nav>

        {/* Footer / Logout */}
        <div>
          {user ? (
            <Button
              onClick={() => setShowLogoutDialog(true)}
              className="w-full !bg-background !text-foreground !rounded-xl !text-lg !font-bold !py-3 !shadow-md hover:opacity-90 mt-5 flex items-center justify-center gap-2"
            >
              <LogOutIcon className="size-5" />
              Logout
            </Button>
          ) : (
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="w-full button relative text-sm !bg-background !text-foreground !rounded-xl !font-bold !py-3 !shadow-md hover:opacity-90 mt-5 text-center block"
            >
              Sign In
            </Link>
          )}

          {/* Confirm Dialog for logout */}
          <ConfirmDialog
            isOpen={showLogoutDialog}
            body="Are you sure you want to log out?"
            onClose={() => setShowLogoutDialog(false)}
            buttons={[
              {
                label: "Cancel",
                onClick: () => setShowLogoutDialog(false),
                variant: "secondary",
              },
              {
                label: "Log Out",
                onClick: handleLogout,
                variant: "danger",
              },
            ]}
          />

          <Link
            href="#"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 mt-4"
          >
            <span className="font-semibold">Contact Support</span>
            <SendIcon className="size-5" />
          </Link>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ icon, label, href, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="w-full flex items-center justify-between hover:bg-foreground/80 text-white font-semibold text-lg py-4 border-b-2 border-white transition-colors"
    >
      <span className="flex items-center gap-3">
        {icon}
        {label}
      </span>
      <ChevronRightIcon className="size-6" />
    </Link>
  );
}