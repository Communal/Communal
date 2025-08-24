// app/admin/page.js
import { getUserFromToken } from "@/lib/getUserFromToken";
import DashboardClient from "@/components/DashboardClient";

export default async function AdminPage() {
  const user = await getUserFromToken();

  if (!user || user.role !== "ADMIN") {
    return <div className="p-6">Access denied</div>;
  }

  // Pass user safely down to the client component
  return <DashboardClient user={user} />;
}
