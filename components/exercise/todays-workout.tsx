"use client"

import { useExercisePlans, getTodaysPlan } from "@/lib/store"
import { CheckCircle2, Circle, Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"

export function TodaysWorkout() {
  const { plans, toggleExercise } = useExercisePlans()
  const todaysPlan = getTodaysPlan(plans)

  if (!todaysPlan) {
    return (
      <div className="rounded-2xl border border-exercise-primary/20 bg-exercise-card p-6">
        <h3 className="font-display text-lg font-bold text-foreground">Today&apos;s Workout</h3>
        <div className="mt-4 flex flex-col items-center gap-2 py-6 text-exercise-muted">
          <Dumbbell className="h-8 w-8" />
          <p className="text-sm">No workout scheduled for today</p>
          <p className="text-xs">Enjoy your rest day!</p>
        </div>
      </div>
    )
  }

  const completedCount = todaysPlan.exercises.filter((e) => e.completed).length

  return (
    <div className="rounded-2xl border border-exercise-primary/20 bg-exercise-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">{todaysPlan.name}</h3>
          <p className="text-sm text-exercise-muted">{todaysPlan.dayOfWeek}</p>
        </div>
        <span className="rounded-full bg-exercise-accent px-3 py-1 text-xs font-semibold text-exercise-primary">
          {completedCount}/{todaysPlan.exercises.length}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {todaysPlan.exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => toggleExercise(todaysPlan.id, exercise.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
              exercise.completed
                ? "border-exercise-primary/20 bg-exercise-accent/50"
                : "border-exercise-primary/10 bg-exercise-card hover:border-exercise-primary/30"
            )}
          >
            {exercise.completed ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-exercise-primary" />
            ) : (
              <Circle className="h-5 w-5 shrink-0 text-exercise-muted" />
            )}
            <div className="flex-1">
              <p className={cn(
                "text-sm font-medium",
                exercise.completed ? "text-exercise-muted line-through" : "text-foreground"
              )}>
                {exercise.name}
              </p>
              <p className="text-xs text-exercise-muted">
                {exercise.sets} sets x {exercise.reps} reps
                {exercise.weight > 0 && ` @ ${exercise.weight}kg`}
              </p>
            </div>
            <span className="rounded-md bg-exercise-accent px-2 py-0.5 text-xs font-medium capitalize text-exercise-primary">
              {exercise.bodyPart}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
