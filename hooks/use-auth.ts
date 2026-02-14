import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    router.push('/login')
    router.refresh()
  }

  return { user, isLoading, signOut: handleSignOut }
}

