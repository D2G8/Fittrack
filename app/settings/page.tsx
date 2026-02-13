"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProfile } from "@/lib/store"
import { ArrowLeft, User, Target, Weight, Save, Bell, Shield, Palette } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { profile, updateProfile } = useProfile()
  const [form, setForm] = useState({
    name: profile.name,
    age: profile.age,
    weight: profile.weight,
    targetWeight: profile.targetWeight,
    objective: profile.objective,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
          {/* Profile Section */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display text-lg font-bold text-foreground">Profile</h2>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-foreground">Age</label>
                  <input
                    id="age"
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: +e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="mb-1.5 block text-sm font-medium text-foreground">
                    <span className="flex items-center gap-1">
                      <Weight className="h-3.5 w-3.5" /> Weight (kg)
                    </span>
                  </label>
                  <input
                    id="weight"
                    type="number"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: +e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="targetWeight" className="mb-1.5 block text-sm font-medium text-foreground">
                  <span className="flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" /> Target Weight (kg)
                  </span>
                </label>
                <input
                  id="targetWeight"
                  type="number"
                  value={form.targetWeight}
                  onChange={(e) => setForm({ ...form, targetWeight: +e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="objective" className="mb-1.5 block text-sm font-medium text-foreground">Objective</label>
                <select
                  id="objective"
                  value={form.objective}
                  onChange={(e) => setForm({ ...form, objective: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                >
                  <option>Lose Weight & Build Muscle</option>
                  <option>Build Muscle</option>
                  <option>Lose Weight</option>
                  <option>Maintain Weight</option>
                  <option>Improve Endurance</option>
                  <option>General Fitness</option>
                </select>
              </div>
            </div>
          </section>

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

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground/90"
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Changes"}
          </button>

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
