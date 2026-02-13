"use client"

import { useMissions } from "@/lib/store"
import { CheckCircle2, Circle, Zap, Dumbbell, UtensilsCrossed, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const typeIcon = {
  exercise: Dumbbell,
  food: UtensilsCrossed,
  general: Star,
}

export function MissionsCard() {
  const { missions, toggleMission } = useMissions()

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">Daily Missions</h3>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          {missions.filter(m => m.completed).length}/{missions.length}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {missions.map((mission) => {
          const Icon = typeIcon[mission.type]
          return (
            <button
              key={mission.id}
              onClick={() => toggleMission(mission.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all",
                mission.completed
                  ? "border-border/50 bg-secondary/50"
                  : "border-border bg-card hover:border-foreground/20"
              )}
            >
              {mission.completed ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-foreground" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium",
                  mission.completed ? "text-muted-foreground line-through" : "text-foreground"
                )}>
                  {mission.title}
                </p>
                <p className="text-xs text-muted-foreground">{mission.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex items-center gap-0.5 text-xs font-semibold text-foreground">
                  <Zap className="h-3 w-3" />
                  {mission.xpReward}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
