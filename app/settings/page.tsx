"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/supabase"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { useProfile } from "@/lib/store"
import { ArrowLeft, Bell, Shield, Palette } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { } = useProfile()

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)
      
      if (!currentUser) {
        router.push("/login")
      }
    }
    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.push("/")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-xl font-bold text-foreground">Settings</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Notifications Section */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display text-lg font-bold text-foreground">Notifications</h2>
            </div>
            <div className="flex flex-col gap-3">
              {["Workout Reminders", "Meal Logging Reminders", "Mission Alerts", "Weekly Progress Report"].map((item) => (
                <label key={item} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm text-foreground">{item}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-foreground" />
                </label>
              ))}
            </div>
          </section>

          {/* Privacy Section */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display text-lg font-bold text-foreground">Privacy</h2>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm text-foreground">Public Profile</span>
                <input type="checkbox" className="h-4 w-4 accent-foreground" />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm text-foreground">Share Progress</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-foreground" />
              </label>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display text-lg font-bold text-foreground">Appearance</h2>
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm text-foreground">Units</span>
                <select className="rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground">
                  <option>Metric (kg, cm)</option>
                  <option>Imperial (lbs, in)</option>
                </select>
              </label>
            </div>
          </section>


          {/* Danger Zone */}
          <section className="rounded-2xl border border-destructive/30 bg-card p-5">
            <h2 className="font-display text-lg font-bold text-destructive">Danger Zone</h2>
            <p className="mt-1 text-sm text-muted-foreground">These actions cannot be undone.</p>
            <div className="mt-4 flex flex-col gap-2">
              <button className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                Reset All Data
              </button>
              <button className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
