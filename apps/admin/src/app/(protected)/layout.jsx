"use client";

import { useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import { useAdminStore } from "@/store/adminStore";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedLayout({ children }) {
    const { user, loading, hydrated, initializeAdmin } = useAdminStore();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize session once hydrated
    useEffect(() => {
        if (hydrated) {
            initializeAdmin();
        }
    }, [hydrated, initializeAdmin]);

    // Handle redirects only after hydration + not loading
    useEffect(() => {
        if (!hydrated || loading) return;

        if (!user && pathname !== "/login") {
            router.push("/login");
        } else if (user && pathname === "/login") {
            router.push("/");
        }
    }, [hydrated, loading, user, pathname, router]);

    if (!hydrated || loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return <>
        <AdminHeader />
        {children}
    </>;
}
