"use client"
import { Input } from "@/components/Input"
import Button from "@/components/Button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      setLoading(false)

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      router.push("/")
    } catch (err) {
      setLoading(false)
      setError("Something went wrong")
    }
  }

  return (
    <div className="flex flex-col justify-center bg-background px-4 py-8 min-h-screen">
      <div className="flex flex-col items-center mt-20 w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Communal Shop
        </h1>
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  )
}
