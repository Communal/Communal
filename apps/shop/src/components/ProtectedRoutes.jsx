"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "../app/api/useUser";
import { getUser } from "../app/api/user";  // ✅ use your API wrapper

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const { setUser } = useUser();

  const publicRoutes = ["/login", "/signup"];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && !publicRoutes.includes(pathname)) {
      router.replace("/login");
      setLoading(false);
      return;
    }

    if (token) {
      (async () => {
        try {
          const user = await getUser();  // ✅ fetch full user
          setUser({ token, ...user });
        } catch (err) {
          console.error("Failed to fetch user:", err);
          localStorage.removeItem("token");
          router.replace("/login");
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [pathname, router, setUser]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
