"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import SearchBar from "@/components/SearchBar";
import BackHome from "@/components/Home";
import PurchaseCard from "@/components/PurchaseCard";
import { toast } from "sonner";

function PurchaseSkeleton() {
  return (
    <div className="border p-3 rounded shadow-sm bg-white animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
      <div className="h-3 bg-gray-100 rounded w-1/5"></div>
    </div>
  );
}

export default function PurchaseHistory() {
  const router = useRouter();
  const { user, hasHydrated, fetchUser } = useUserStore();
  const [purchases, setPurchases] = useState([]);
  const [status, setStatus] = useState("loading");
  const [searchTerm, setSearchTerm] = useState("");

  const loadPurchases = async (search = "") => {
    try {
      if (!user?._id) return;

      setStatus("loading");
      const query = new URLSearchParams({
        userId: user._id,
        ...(search && { search }),
      });

      const res = await fetch(`/api/purchase-history?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to load purchases");

      const data = await res.json();
      setPurchases(Array.isArray(data) ? data : []);
      setStatus("ready");

      toast.success("Purchase history loaded successfully!");
    } catch (err) {
      console.error("Purchase history error:", err);
      toast.error("Unable to load your purchase history. Please try again.");
      setStatus("error");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!hasHydrated) return;

      if (!user?._id && localStorage.getItem("token")) {
        await fetchUser();
      }

      if (user?._id) {
        loadPurchases();
      }
    };

    init();
  }, [user, hasHydrated, fetchUser]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.warning("Enter a search term first.");
      return;
    }
    loadPurchases(searchTerm);
  };

  // NAVIGATE to detail page instead of opening modal
  const handleViewDetails = (purchase) => {
    // validate productId before navigating
    const rawPid = purchase?.productId || purchase?.product || purchase?.product_id;
    const pid =
      typeof rawPid === "object" && rawPid !== null
        ? rawPid._id?.toString?.() || rawPid.toString?.()
        : rawPid?.toString?.();

    if (!pid || pid === "null") {
      toast.warning("This purchase has no linked product record.");
      return;
    }

    router.push(`/purchase/${pid}`);

  };

  return (
    <div className="w-full p-1">
      <BackHome />
      <h2 className="text-2xl text-center font-bold mb-4">Purchase History</h2>

      <SearchBar search={searchTerm} setSearch={setSearchTerm} onSubmit={handleSearch} />

      <div className="mt-6 space-y-4">
        {status === "loading" ? (
          <>
            <PurchaseSkeleton />
            <PurchaseSkeleton />
            <PurchaseSkeleton />
          </>
        ) : status === "error" ? (
          <p className="text-red-500 text-center">Please login to view history</p>
        ) : purchases.length === 0 ? (
          <p className="text-center text-gray-500">No purchases found</p>
        ) : (
          purchases.map((purchase) => (
            <PurchaseCard
              key={purchase._id}
              purchase={purchase}
              onViewDetails={() => handleViewDetails(purchase)}
            />
          ))
        )}
      </div>
    </div>
  );
}
