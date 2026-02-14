"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { NavBar } from "@/components/nav-bar"
import { BodyModel } from "@/components/exercise/body-model"
import { TodaysWorkout } from "@/components/exercise/todays-workout"
import { PlanEditor } from "@/components/exercise/plan-editor"
import { TrainingLog } from "@/components/exercise/training-log"
import { useExercisePlans, getBodyPartsForToday } from "@/lib/store"
import { Dumbbell } from "lucide-react"

export default function ExercisePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { plans } = useExercisePlans()
  const activeBodyParts = getBodyPartsForToday(plans)

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
    <div className="min-h-screen bg-exercise-bg pb-24">
      <header className="sticky top-0 z-40 border-b border-exercise-primary/10 bg-exercise-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-exercise-primary">
            <Dumbbell className="h-4 w-4 text-exercise-primary-foreground" />
          </div>
          <h1 className="font-display text-xl font-bold text-foreground">Exercise</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="flex flex-col gap-5">
          <BodyModel activeBodyParts={activeBodyParts} />
          <TodaysWorkout />
          <PlanEditor />
          <TrainingLog />
        </div>
      </main>

      <NavBar />
    </div>
  )
}
