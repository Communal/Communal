"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "../app/api/useUser";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const { setUser } = useUser();

    const publicRoutes = ["/login", "/signup"];

    useEffect(() => {
        const token = localStorage.getItem("token"); // ✅ JWT
        const storedUser = localStorage.getItem("user") || localStorage.getItem("userStorage");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        // 🚨 If no token AND no user → redirect (unless on public route)
        if (!token && !parsedUser && !publicRoutes.includes(pathname)) {
            router.replace("/login");
            setLoading(false);
            return;
        }

        // ✅ If user is stored, trust it
        if (parsedUser?.user) {
            setUser({ token, ...parsedUser.user });
        } else if (parsedUser) {
            setUser({ token, ...parsedUser }); // fallback if structure differs
        }

        setLoading(false);
    }, [pathname, router, setUser]);

    if (loading) return <p>Loading...</p>;

    return <>{children}</>;
}
