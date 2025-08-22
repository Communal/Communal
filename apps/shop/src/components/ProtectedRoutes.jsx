"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore, decodeToken } from "../store/userStore";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const { setUser } = useUser();

    // Get state and actions from Zustand store
    const { user, hasHydrated, fetchUser, tokenExpired } = useUserStore();

    const publicRoutes = ["/login", "signup"];

    useEffect(() => {
        console.log("🔍 ProtectedRoute check starting...");
        console.log("➡️ Current pathname:", pathname);
        console.log("👤 User state:", user);
        console.log("🔄 Has hydrated:", hasHydrated);

        // Wait for Zustand to rehydrate from localStorage
        if (!hasHydrated) {
            console.log("⏳ Waiting for hydration...");
            return;
        }

        const token = localStorage.getItem("token");
        console.log("📦 LocalStorage token:", token);

        // Additional token validation
        let isTokenValid = true;
        if (token) {
            const decoded = decodeToken(token);
            console.log("🔐 Decoded token:", decoded);
            isTokenValid = decoded && !decoded.expired;
        }

        // If no valid token and not on public route, redirect to login
        if (!token || !isTokenValid) {
            if (!publicRoutes.includes(pathname)) {
                console.warn("❌ No valid token found, redirecting to /login");
                router.replace("/login");
            }
            setLoading(false);
            return;
        }

        // If token exists but user is not set, fetch user data
        if (token && !user) {
            console.log("🔄 Token exists but user not loaded, fetching user...");
            fetchUser().finally(() => {
                setLoading(false);
            });
            return;
        }

        // If we have a user and token is valid, allow access
        if (user && token && isTokenValid) {
            console.log("✅ User authenticated, allowing access");
            setLoading(false);
            return;
        }

        setLoading(false);
    }, [pathname, router, user, hasHydrated, fetchUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}
