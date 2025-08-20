// components/ProtectedRoute.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    // Routes that do NOT require login
    const publicRoutes = ["/login", "/signup"];

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token && !publicRoutes.includes(pathname)) {
            router.replace("/login");
        } else {
            setLoading(false);
        }
    }, [pathname, router]);

    if (loading) return <p>Loading...</p>;

    return <>{children}</>;
}