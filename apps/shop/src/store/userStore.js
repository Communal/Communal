import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUser } from "@/app/api/user";
import jwt from "jsonwebtoken"; // already installed

// Decode JWT without verifying signature (safe for client use)
function decodeToken(token) {
  try {
    const decoded = jwt.decode(token); // { id, email, role, iat, exp }

    if (!decoded) return null;

    const now = Date.now() / 1000; // seconds
    if (decoded.exp && decoded.exp < now) {
      return { expired: true, ...decoded };
    }

    return { expired: false, ...decoded };
  } catch {
    return null;
  }
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      tokenExpired: false,
      userRole: null,
      balance: 0,
      hasHydrated: false,

      // Fetch user with JWT check
      fetchUser: async () => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("token")
              : null;

          if (!token) {
            set({ user: null });
            return;
          }

          const decoded = decodeToken(token);
          if (!decoded) {
            set({ error: "Invalid token", user: null });
            return;
          }

          if (decoded.expired) {
            set({ tokenExpired: true, user: null });
            localStorage.removeItem("token"); // cleanup expired token
            return;
          }

          const u = await getUser();

          if (!u) {
            set({ error: "User not found", user: null });
            return;
          }

          // Normalize user object
          set({
            user: {
              ...u,
              _id: u._id || u.id,
            },
            userRole: u.role,
            balance: parseFloat(u.balance?.$numberDecimal || 0),
          });
        } catch (err) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      // Normalize user when setting manually
      setUser: (user) =>
        set({
          user: {
            ...user,
            _id: user._id || user.id,
            role: user?.role || null,
            balance: parseFloat(user?.balance?.$numberDecimal || 0),
          },
        }),

      clearUser: () =>
        set({
          user: null,
          tokenExpired: false,
          userRole: null,
          balance: 0,
        }),

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        // Auto-fetch if token exists
        if (typeof window !== "undefined" && localStorage.getItem("token")) {
          state?.fetchUser();
        }
      },
    }
  )
);

// Ensure user is loaded
export const ensureUserLoaded = async () => {
  const state = useUserStore.getState();
  if (!state.user && !state.loading) {
    await state.fetchUser(true); // force fetch
  }
  return useUserStore.getState().user;
};
