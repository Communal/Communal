// app/admin/page.js
import { getUserFromToken } from '@/lib/getUserFromToken'

export default async function AdminPage() {
  const user = await getUserFromToken()

  if (!user || user.role !== 'ADMIN') {
    return <div>Access denied</div>
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.firstName}!</p>
    </div>
  )
}