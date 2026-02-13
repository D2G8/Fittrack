"use client"

import { useDailyNutrition } from "@/lib/store"
import { Flame } from "lucide-react"

export function CalorieTracker() {
  const { nutrition } = useDailyNutrition()

  const totalCalories = nutrition.entries.reduce((sum, e) => sum + e.calories, 0)
  const totalProtein = nutrition.entries.reduce((sum, e) => sum + e.protein, 0)
  const totalCarbs = nutrition.entries.reduce((sum, e) => sum + e.carbs, 0)
  const totalFat = nutrition.entries.reduce((sum, e) => sum + e.fat, 0)
  const remaining = nutrition.targetCalories - totalCalories
  const progress = Math.min((totalCalories / nutrition.targetCalories) * 100, 100)

  const circumference = 2 * Math.PI * 60
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="rounded-2xl border border-food-primary/20 bg-food-card p-5">
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-food-primary" />
        <h3 className="font-display text-lg font-bold text-foreground">Daily Calories</h3>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="relative">
          <svg width="160" height="160" className="-rotate-90">
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="hsl(var(--food-accent))"
              strokeWidth="10"
            />
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="hsl(var(--food-primary))"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold text-foreground">{totalCalories}</span>
            <span className="text-xs text-food-muted">of {nutrition.targetCalories} kcal</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className={`text-sm font-semibold ${remaining > 0 ? "text-food-primary" : "text-red-500"}`}>
          {remaining > 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over target`}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-food-accent/50 p-3 text-center">
          <p className="font-display text-lg font-bold text-foreground">{totalProtein}g</p>
          <p className="text-xs text-food-muted">Protein</p>
        </div>
        <div className="rounded-xl bg-food-accent/50 p-3 text-center">
          <p className="font-display text-lg font-bold text-foreground">{totalCarbs}g</p>
          <p className="text-xs text-food-muted">Carbs</p>
        </div>
        <div className="rounded-xl bg-food-accent/50 p-3 text-center">
          <p className="font-display text-lg font-bold text-foreground">{totalFat}g</p>
          <p className="text-xs text-food-muted">Fat</p>
        </div>
      </div>
    </div>
  )
}
