export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-600">
      <h1 className="text-3xl font-bold">Access Denied</h1>
      <p className="mt-2">You do not have permission to access this page.</p>
    </div>
  )
}
