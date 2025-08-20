"use client";

import { useState, useEffect } from "react";
import { getUser } from "./user";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          setError("No user token found");
          setUser(null);
          return;
        }

        const u = await getUser();
        if (!ignore) setUser(u);
      } catch (err) {
        if (!ignore) setError(err.message || "Failed to fetch user");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchUser();
    return () => {
      ignore = true;
    };
  }, []);

  return { user, loading, error };
}
