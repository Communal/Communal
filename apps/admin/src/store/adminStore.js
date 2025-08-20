// stores/adminStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminStore = create(
  persist(
    (set, get) => {
      const initializeAdmin = async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/me", { credentials: "include" });

          if (!res.ok) {
            set({ user: null, loading: false, error: null });
            return;
          }

          const data = await res.json();
          set({ user: data.user, loading: false, error: null });
        } catch (err) {
          set({ user: null, loading: false, error: "Something went wrong" });
        }
      };

      const logout = async () => {
        await fetch("/api/logout", { method: "POST" });
        set({ user: null });
      };

      return {
        user: null,
        loading: false,
        error: null,
        hydrated: false, // <-- NEW
        login: (userData) => set({ user: userData, error: null }),
        logout,
        initializeAdmin,
        setHydrated: () => set({ hydrated: true }), // <-- NEW
      };
    },
    {
      name: "admin-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated?.(); // mark when store has rehydrated
      },
    }
  )
);
