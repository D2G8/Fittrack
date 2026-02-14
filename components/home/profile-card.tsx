"use client"

import { useState } from "react"
import { useProfile } from "@/lib/store"
import { User, Target, Weight, Edit2, Save, X } from "lucide-react"

export function ProfileCard() {
  const { profile, updateProfile } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: profile.name,
    age: profile.age,
    weight: profile.weight,
    targetWeight: profile.targetWeight,
    objective: profile.objective,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await updateProfile({
      name: form.name,
      age: form.age,
      weight: form.weight,
      targetWeight: form.targetWeight,
      objective: form.objective,
    })
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCancel = () => {
    setForm({
      name: profile.name,
      age: profile.age,
      weight: profile.weight,
      targetWeight: profile.targetWeight,
      objective: profile.objective,
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-foreground">Edit Profile</h2>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-foreground/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              {saved ? "Saved!" : "Save"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="edit-name" className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
            <input
              id="edit-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-age" className="mb-1.5 block text-sm font-medium text-foreground">Age</label>
              <input
                id="edit-age"
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: +e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="edit-weight" className="mb-1.5 block text-sm font-medium text-foreground">
                <span className="flex items-center gap-1">
                  <Weight className="h-3.5 w-3.5" /> Weight (kg)
                </span>
              </label>
              <input
                id="edit-weight"
                type="number"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: +e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="edit-targetWeight" className="mb-1.5 block text-sm font-medium text-foreground">
              <span className="flex items-center gap-1">
                <Target className="h-3.5 w-3.5" /> Target Weight (kg)
              </span>
            </label>
            <input
              id="edit-targetWeight"
              type="number"
              value={form.targetWeight}
              onChange={(e) => setForm({ ...form, targetWeight: +e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="edit-objective" className="mb-1.5 block text-sm font-medium text-foreground">Objective</label>
            <select
              id="edit-objective"
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
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-secondary">
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
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground">{profile.name}</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{profile.age} years old</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span className="flex items-center gap-1">
              <Weight className="h-3.5 w-3.5" />
              {profile.weight} kg
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span className="flex items-center gap-1">
              <Target className="h-3.5 w-3.5" />
              {profile.targetWeight} kg
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