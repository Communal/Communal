"use client";
import { useState } from "react";
import {
  Menu as MenuIcon,
  X as XIcon,
  Home as HomeIcon,
  User as UserIcon,
  ShoppingCart as OrdersIcon,
  Clock as HistoryIcon,
  HelpCircle as FaqIcon,
  ChevronRightIcon,
  SendIcon,
  BadgeDollarSignIcon,
} from "lucide-react";
import Button from "./Button";
import Link from "next/link";
import ConfirmDialog from "./DialogBox";
import { useUser } from "../app/api/useUser";

export default function SidebarDrawer() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <>
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
        className={`fixed top-0 left-0 z-50 h-full w-full sm:w-4/5 max-w-xs bg-foreground pb-10 text-background p-4 flex flex-col transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "-translate-x-full"
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

        <div className="space-y-5 flex-1 overflow-y-auto hide-scrollbar">
          {/* <h2 className="text-2xl font-bold mt-5">
            {user?.firstName
              ? `Welcome, ${user.firstName}`
              : "Please Sign In Below"}
          </h2> */}

          <div className="rounded-xl shadow-md overflow-hidden">
            <div className="flex items-center justify-between mb-2 bg-background-2 p-2">
              <span className="font-semibold text-lg text-foreground">
                {user?.firstName
                  ? `Welcome, ${user.firstName}`
                  : "Please Sign In Below"}
              </span>
            </div>
            <div className="text-3xl font-bold px-5 py-1.5">
              {user
                ? `₦ ${Number(user.balance?.$numberDecimal || 0)}`
                : "Please sign in"}
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              {user ? (
                <>
                  <Link href="/add-money" onClick={() => setOpen(false)}>
                    <Button
                      size="sm"
                      className="text-foreground bg-background"
                      style={{ boxShadow: "0 2px 4px 0 #e97a00" }}
                    >
                      Add Money
                    </Button>
                  </Link>
                  <Link href="/withdraw" onClick={() => setOpen(false)}>
                    <Button
                      size="sm"
                      className="text-foreground bg-background"
                      style={{ boxShadow: "0 2px 4px 0 #e97a00" }}
                    >
                      Withdraw
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <Button
                      size="sm"
                      className="text-foreground bg-background"
                      style={{ boxShadow: "0 2px 4px 0 #e97a00" }}
                    >
                      Signup
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button
                      size="sm"
                      className="text-foreground bg-background"
                      style={{ boxShadow: "0 2px 4px 0 #e97a00" }}
                    >
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-0.5 mt-10">
            <SidebarLink
              href="/"
              icon={<HomeIcon className="size-6" />}
              label="Home"
              onClick={() => setOpen(false)}
            />
            <SidebarLink
              href="/profile"
              icon={<UserIcon className="size-6" />}
              label="Profile"
              onClick={() => setOpen(false)}
            />
            <SidebarLink
              href="/cart"
              icon={<OrdersIcon className="size-6" />}
              label="Cart"
              onClick={() => setOpen(false)}
            />
            <SidebarLink
              href="/purchase-history"
              icon={<HistoryIcon className="size-6" />}
              label="Purchase History"
              onClick={() => setOpen(false)}
            />
            <SidebarLink
              href="/transaction-history"
              icon={<BadgeDollarSignIcon className="size-6" />}
              label="Transaction History"
              onClick={() => setOpen(false)}
            />
            <SidebarLink
              href="/faq"
              icon={<FaqIcon className="size-6" />}
              label="FAQs"
              onClick={() => setOpen(false)}
            />
          </nav>
        </div>

        {/* Contact & Logout */}
        <div>
          {user ? (
            <Button
              onClick={() => setShowLogoutDialog(true)}
              className="w-full !bg-background !text-foreground !rounded-xl !text-xl !font-bold !py-3 !shadow-md !border-0 hover:opacity-90 mt-5"
            >
              Logout
            </Button>
          ) : (
            <Link
              onClick={() => setOpen(false)}
              className="w-full button relative text-sm !bg-background !text-foreground !rounded-xl !font-bold !py-3 !shadow-md !border-0 hover:opacity-90 mt-5"
              href="/login"
            >
              Sign in
            </Link>
          )}
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
                onClick: () => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                },
                variant: "danger",
              },
            ]}
          />

          <Link
            href="#"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 mt-4"
          >
            <span className="font-semibold">Contact Us :</span>
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
