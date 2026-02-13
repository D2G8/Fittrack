"use client"

import { useProfile } from "@/lib/store"
import { User, Target, Weight } from "lucide-react"

export function ProfileCard() {
  const { profile } = useProfile()

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt={`${profile.name}'s profile`}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <User className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold text-foreground">{profile.name}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{profile.age} years old</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span className="flex items-center gap-1">
              <Weight className="h-3.5 w-3.5" />
              {profile.weight} kg
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Target className="h-4 w-4" />
            <span>{profile.objective}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
