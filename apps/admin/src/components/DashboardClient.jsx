// app/admin/DashboardClient.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardClient({ user }) {
  const [stats, setStats] = useState({ sold: 0, unsold: 0 });
  const [nonAdminCount, setNonAdminCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/product/unsold-products");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/non-users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setNonAdminCount(data.nonAdminCount); // match route response
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome, {user.firstName}!</p>

      {/* Products Overview */}
      <div
        onClick={() => router.push("/orders")}
        className="cursor-pointer p-3 rounded-xl shadow-md bg-white hover:shadow-lg transition"
      >
        <h2 className="text-lg font-semibold mb-4">Products Overview</h2>

        <div className="flex justify-between text-sm">
          <span className="font-medium text-green-600">
            Sold: {stats.sold}
          </span>
          <span className="font-medium text-red-600">
            Unsold: {stats.unsold}
          </span>
        </div>
      </div>

      {/* Users Overview */}
      <div className="p-3 rounded-xl shadow-md flex items-center space-x-2 bg-white hover:shadow-lg transition">
        <p className="text-lg font-semibold">Users:</p>
        <span className="text-lg">{nonAdminCount}</span>
      </div>

    </div>
  );
}
