"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { Input } from "@/components/Input";
import BackHome from "@/components/Home";

export default function ProfilePage() {
  const { user, loading, error, fetchUser } = useUserStore();

  // Fetch user data if not already loaded
  useEffect(() => {
    if (!user && !loading) {
      fetchUser();
    }
  }, [user, loading, fetchUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No user found. Please log in.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fffaf0] flex flex-col">
      {/* Header */}
      {/* <div className="bg- px-4 pt-4 pb-2">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center bg-[#fffaf0] text-foreground font-bold rounded-xl px-4 text-lg mb-4"
          >
            <span className="mr-2">&#8592;</span> Home
          </Link>
        </div>
      </div> */}
      <BackHome/>

      {/* Main Content */}
      <main className="flex-1 flex w-full flex-col items-center px-2 py-6">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
          Profile
        </h1>

        <form className="w-full flex flex-col gap-4">
          {/* First Name */}
          <div>
            <label className="block text-foreground font-bold mb-1 text-lg">
              First Name
            </label>
            <Input
              type="text"
              defaultValue={user.firstName || ""}
              className="bg-[#fffaf0] border-2 border-foreground text-lg rounded-xl px-4 py-3 w-full"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-foreground font-bold mb-1 text-lg">
              Last Name
            </label>
            <Input
              type="text"
              defaultValue={user.lastName || ""}
              className="bg-[#fffaf0] border-2 border-foreground text-lg rounded-xl px-4 py-3 w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-foreground font-bold mb-1 text-lg">
              Email
            </label>
            <Input
              type="email"
              defaultValue={user.email || ""}
              className="bg-[#fffaf0] border-2 border-foreground text-lg rounded-xl px-4 py-3 w-full"
              readOnly
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-foreground font-bold mb-1 text-lg">
              Phone
            </label>
            <Input
              type="tel"
              defaultValue={user.phone || ""}
              className="bg-[#fffaf0] border-2 border-foreground text-lg rounded-xl px-4 py-3 w-full"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-foreground font-bold mb-1 text-lg">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="bg-[#fffaf0] border-2 border-foreground text-lg rounded-xl px-4 py-3 w-full"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-foreground font-bold mb-1 text-lg">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Confirm new password"
              className="bg-[#fffaf0] border-2 border-foreground text-lg rounded-xl px-4 py-3 w-full"
            />
          </div>

          <button
            type="submit"
            className="mt-6 bg-foreground text-white font-bold text-xl rounded-xl py-4 w-full hover:opacity-90"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}