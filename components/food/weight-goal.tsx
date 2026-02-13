"use client"

import { useProfile } from "@/lib/store"
import { TrendingDown, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function WeightGoal() {
  const { profile } = useProfile()

  const startWeight = 90
  const totalToLose = startWeight - profile.targetWeight
  const lost = startWeight - profile.weight
  const progress = Math.min(Math.max((lost / totalToLose) * 100, 0), 100)
  const remaining = profile.weight - profile.targetWeight

  return (
    <div className="rounded-2xl border border-food-primary/20 bg-food-card p-5">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-food-primary" />
        <h3 className="font-display text-lg font-bold text-foreground">Weight Goal</h3>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-foreground">{profile.weight}</p>
          <p className="text-xs text-food-muted">Current (kg)</p>
        </div>
        <div className="flex flex-1 items-center justify-center px-4">
          <TrendingDown className="h-6 w-6 text-food-primary" />
        </div>
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-food-primary">{profile.targetWeight}</p>
          <p className="text-xs text-food-muted">Target (kg)</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-food-muted">
          <span>{lost}kg lost</span>
          <span>{remaining > 0 ? `${remaining}kg to go` : "Goal reached!"}</span>
        </div>
        <Progress value={progress} className="h-2.5 bg-food-accent [&>div]:bg-food-primary" />
      </div>

      <p className="mt-3 text-center text-xs text-food-muted">
        {progress.toFixed(0)}% of your goal achieved
      </p>
    </div>
  )
}
