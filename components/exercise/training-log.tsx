"use client"

import { useTrainingLogs } from "@/lib/store"
import { Calendar, Clock, Dumbbell, CheckCircle2 } from "lucide-react"

export function TrainingLog() {
  const { logs } = useTrainingLogs()

  return (
    <div className="rounded-2xl border border-exercise-primary/20 bg-exercise-card p-5">
      <h3 className="font-display text-lg font-bold text-foreground">Training Log</h3>
      <p className="text-sm text-exercise-muted">Recent workouts</p>

      <div className="mt-4 flex flex-col gap-3">
        {logs.map((log) => {
          const dateObj = new Date(log.date)
          const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" })
          const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })

          return (
            <div
              key={log.id}
              className="flex items-center gap-4 rounded-xl border border-exercise-primary/10 bg-exercise-bg/50 p-3.5"
            >
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-exercise-accent">
                <span className="text-[10px] font-semibold uppercase text-exercise-primary">{dayName}</span>
                <span className="text-xs font-bold text-foreground">{dateStr.split(" ")[1]}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{log.planName}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-exercise-muted">
                  <span className="flex items-center gap-1">
                    <Dumbbell className="h-3 w-3" />
                    {log.exercises.length} exercises
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {log.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {log.exercises.filter((e) => e.completed).length}/{log.exercises.length}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {logs.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-6 text-exercise-muted">
            <Calendar className="h-8 w-8" />
            <p className="text-sm">No training logs yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
