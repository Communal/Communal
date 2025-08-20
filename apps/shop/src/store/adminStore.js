// stores/adminStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminStore = create(
  persist(
    (set) => {
      const initializeAdmin = async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/admin/me", {
            credentials: "include",
          });
          if (!res.ok) throw new Error("Not authenticated");

          const data = await res.json();
          set({ user: data.user, loading: false });
        } catch (err) {
          set({ user: null, loading: false, error: "Session expired" });
        }
      };

      const logout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        set({ user: null });
      };

      return {
        user: null,
        loading: false,
        error: null,
        login: (userData) => set({ user: userData, error: null }),
        logout,
        initializeAdmin,
      };
    },
    { name: "admin-storage" }
  )
);
