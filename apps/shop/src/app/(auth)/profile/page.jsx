"use client";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { useUser } from "../../../app/api/useUser";
import { Input } from "../../../components/Input";

export default function ProfilePage() {
    const { user, loading, error, fetchUser, userRole, balance } = useUserStore();

  // const { user, isLoading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No user found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] flex flex-col">
      {/* Header */}
      <div className="bg-foreground px-4 pt-4 pb-2">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center bg-[#fffaf0] text-foreground font-bold rounded-xl px-4 text-lg mb-4"
          >
            <span className="mr-2">&#8592;</span> Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-2 py-6">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
          Profile
        </h1>
        <form className="w-full max-w-xl flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="block text-foreground font-bold mb-1 text-lg">
              Username
            </label>
            <Input
              type="text"
              defaultValue={user.username}
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
              defaultValue={user.email}
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
              defaultValue=""
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
              defaultValue=""
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
