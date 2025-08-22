// store/userStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUser } from "@/app/api/user";
import jwt from "jsonwebtoken";

// Decode JWT without verifying signature (safe for client use)
export function decodeToken(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return null;
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      return { expired: true, ...decoded };
    }
    return { expired: false, ...decoded };
  } catch {
    return null;
  }
}

/**
 * Normalize balance values:
 * - If Mongo returns { $numberDecimal: "1000.00" } we'll pull the string "1000.00"
 * - If it's a number or string, use it
 * We store user.balance as a string (exact decimal), and store.balance as a Number for arithmetic.
 */
function normalizeBalanceValue(raw) {
  // prefer $numberDecimal (from Mongo) — keep as string
  if (raw && typeof raw === "object" && raw.$numberDecimal !== undefined) {
    // ensure it's a string with exact decimal
    return String(raw.$numberDecimal);
  }
  if (raw === undefined || raw === null) return "0.00";
  // If already a number or string, return string form with two decimals if numeric
  if (typeof raw === "number") return raw.toFixed(2);
  if (typeof raw === "string") {
    // If string is numeric, normalize formatting to two decimals
    const n = Number(raw);
    return Number.isFinite(n) ? n.toFixed(2) : raw;
  }
  // fallback
  return "0.00";
}

function normalizeUser(u = {}, tokenFallbackRole = null) {
  const normalizedBalanceStr = normalizeBalanceValue(u?.balance);
  const normalizedNumber = parseFloat(normalizedBalanceStr || "0");

  return {
    ...u,
    _id: u._id || u.id,
    role: u.role || tokenFallbackRole || null,
    // user.balance will be a string like "1000.00" (safe to render)
    balance: normalizedBalanceStr,
  };
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      tokenExpired: false,
      userRole: null,
      // balance (number) kept for arithmetic/display
      balance: 0,
      hasHydrated: false,

      fetchUser: async () => {
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
          const token =
            typeof window !== "undefined"
              ? localStorage.getItem("token")
              : null;

          if (!token) {
            set({ user: null, balance: 0, userRole: null });
            return;
          }

          const decoded = decodeToken(token);
          if (!decoded) {
            set({ error: "Invalid token", user: null });
            return;
          }

          if (decoded.expired) {
            set({ tokenExpired: true, user: null });
            localStorage.removeItem("token");
            return;
          }

          const u = await getUser(); // expects full user from API

          if (!u) {
            // fallback to decoded token if API fails
            const fallbackUser = {
              id: decoded.id,
              email: decoded.email,
              role: decoded.role,
              token,
              balance: 0,
            };
            const norm = normalizeUser(fallbackUser, decoded.role);
            set({
              user: norm,
              userRole: norm.role,
              balance: parseFloat(norm.balance),
            });
            return;
          }

          // Normalize user object (ensures user.balance isn't a Decimal128 object)
          const normalized = normalizeUser(u, decoded.role);
          set({
            user: normalized,
            userRole: normalized.role,
            balance: parseFloat(normalized.balance || "0"),
          });
        } catch (err) {
          set({ error: err?.message || String(err) });
        } finally {
          set({ loading: false });
        }
      },

      // Normalize user when setting manually (e.g. after login)
      setUser: (userPayload) => {
        // If userPayload contains a token, decode for role fallback
        let tokenRole = null;
        if (!userPayload?.role && userPayload?.token) {
          const decoded = decodeToken(userPayload.token);
          tokenRole = decoded?.role || null;
        }

        const normalized = normalizeUser(userPayload, tokenRole);
        set({
          user: normalized,
          userRole: normalized.role,
          balance: parseFloat(normalized.balance || "0"),
        });
      },

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
      // on rehydrate: mark hydrated & kick off fetch to get fresh server state
      onRehydrateStorage: () => (state) => {
        // state is the store API after rehydration
        state?.setHasHydrated(true);

        // If a persisted user exists, immediately normalize it (so components don't see raw objects)
        const persistedUser = state?.user;
        if (persistedUser) {
          // Normalize persisted user.balance if needed
          const normalized = normalizeUser(
            persistedUser,
            persistedUser?.role || null
          );
          state?.setState?.({
            user: normalized,
            userRole: normalized.role,
            balance: parseFloat(normalized.balance || "0"),
          });
        }

        // Then fetch the authoritative user from the API if token exists
        if (typeof window !== "undefined" && localStorage.getItem("token")) {
          state?.fetchUser();
        }
      },
    }
  )
);

// small helper for parts of the app that need to ensure user is loaded
export const ensureUserLoaded = async () => {
  const state = useUserStore.getState();
  if (!state.user && !state.loading) {
    await state.fetchUser();
  }
  return useUserStore.getState().user;
};
