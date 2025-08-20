// lib/getUserFromToken.js
import { cookies } from 'next/headers'
import { verifyToken } from './auth'

export async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  return decoded
}