"use client"

import { useProfile } from "@/lib/store"
import { Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function LevelCard() {
  const { profile } = useProfile()
  const progress = (profile.xp / profile.xpToNextLevel) * 100

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground">
            <span className="font-display text-lg font-bold text-primary-foreground">
              {profile.level}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Level</p>
            <p className="font-display text-lg font-bold text-foreground">Level {profile.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5">
          <Zap className="h-4 w-4 text-foreground" />
          <span className="text-sm font-semibold text-foreground">{profile.xp} XP</span>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress to Level {profile.level + 1}</span>
          <span>{profile.xp} / {profile.xpToNextLevel} XP</span>
        </div>
        <Progress value={progress} className="h-2.5 bg-secondary [&>div]:bg-foreground" />
      </div>
    </div>
  )
}
