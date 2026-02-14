"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Settings, LogIn, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { ProfileCard } from "@/components/home/profile-card"
import { LevelCard } from "@/components/home/level-card"
import { MissionsCard } from "@/components/home/missions-card"
import { getCurrentUser, signOut } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <h1 className="font-display text-xl font-bold text-foreground">Nutrium</h1>
          <div className="flex items-center gap-2">
            {!isLoading && (
              user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground/90"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )
            )}
            <Link
              href="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="flex flex-col gap-5">
          <ProfileCard />
          <LevelCard />
          <MissionsCard />
        </div>
      </main>

      <NavBar />
    </div>
  )
}
