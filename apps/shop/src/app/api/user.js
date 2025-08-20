/**
 * Get a user from the API route using JWT
 * @returns {Promise<Object|null>} - user document or null
 */
export async function getUser() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) throw new Error("No token found");

  const res = await fetch("/api/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.user || null;
}
