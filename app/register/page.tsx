"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft, Dumbbell } from "lucide-react"
import { signUp } from "@/lib/supabase"

const objectives = [
  { value: "Build Muscle", label: "Build Muscle" },
  { value: "Lose Weight", label: "Lose Weight" },
  { value: "Maintain Weight", label: "Maintain Weight" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    age: "",
    weight: "",
    targetWeight: "",
    objective: "Build Muscle"
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (!form.age || parseInt(form.age) < 1 || parseInt(form.age) > 120) {
      setError("Please enter a valid age")
      return
    }
    if (!form.weight || parseFloat(form.weight) < 20 || parseFloat(form.weight) > 300) {
      setError("Please enter a valid weight")
      return
    }
    if (!form.targetWeight || parseFloat(form.targetWeight) < 20 || parseFloat(form.targetWeight) > 300) {
      setError("Please enter a valid target weight")
      return
    }

    setIsLoading(true)
    setError("")

    const { user, error: signUpError } = await signUp(
      form.email, 
      form.password, 
      form.name,
      parseInt(form.age),
      parseFloat(form.weight),
      parseFloat(form.targetWeight),
      form.objective
    )

    if (signUpError) {
      setError(signUpError.message)
      setIsLoading(false)
      return
    }

    if (user) {
      // Profile is automatically created by Supabase trigger
      router.push("/")
      router.refresh()
    }
    setIsLoading(false)
  }

  const updateField = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
    setError("")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-3 px-4 py-4">
        <button
          onClick={() => router.push("/")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground">
              <Dumbbell className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Create account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Start your fitness journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="Repeat your password"
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-foreground">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  placeholder="25"
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="weight" className="mb-1.5 block text-sm font-medium text-foreground">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  min="20"
                  max="300"
                  step="0.1"
                  value={form.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  placeholder="70"
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="targetWeight" className="mb-1.5 block text-sm font-medium text-foreground">
                  Target Weight (kg)
                </label>
                <input
                  id="targetWeight"
                  type="number"
                  min="20"
                  max="300"
                  step="0.1"
                  value={form.targetWeight}
                  onChange={(e) => updateField("targetWeight", e.target.value)}
                  placeholder="70"
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="objective" className="mb-1.5 block text-sm font-medium text-foreground">
                  Objective
                </label>
                <select
                  id="objective"
                  value={form.objective}
                  onChange={(e) => updateField("objective", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                >
                  {objectives.map((obj) => (
                    <option key={obj.value} value={obj.value}>
                      {obj.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 rounded-lg bg-foreground py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground/90"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
