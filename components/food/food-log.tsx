"use client"

import { useState } from "react"
import { useDailyNutrition, type MealEntry } from "@/lib/store"
import { Plus, X, Coffee, Sun, Moon, Cookie } from "lucide-react"
import { cn } from "@/lib/utils"

const mealIcons = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
}

const mealLabels = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
}

export function FoodLog() {
  const { nutrition, addEntry, removeEntry } = useDailyNutrition()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    mealType: "lunch" as MealEntry["mealType"],
  })

  const handleAdd = () => {
    if (!form.name.trim()) return
    addEntry({
      id: `me-${Date.now()}`,
      ...form,
    })
    setForm({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0, mealType: "lunch" })
    setShowAdd(false)
  }

  const grouped = nutrition.entries.reduce<Record<string, MealEntry[]>>((acc, entry) => {
    if (!acc[entry.mealType]) acc[entry.mealType] = []
    acc[entry.mealType].push(entry)
    return acc
  }, {})

  return (
    <div className="rounded-2xl border border-food-primary/20 bg-food-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">Food Log</h3>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 rounded-lg bg-food-primary px-3 py-1.5 text-xs font-medium text-food-primary-foreground transition-colors hover:bg-food-primary/90"
        >
          {showAdd ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showAdd ? "Cancel" : "Add Food"}
        </button>
      </div>

      {showAdd && (
        <div className="mt-4 rounded-xl border border-food-primary/20 bg-food-accent/30 p-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Food name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-food-primary/20 bg-food-card px-3 py-2 text-sm text-foreground placeholder:text-food-muted focus:border-food-primary focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-food-muted">Calories</label>
                <input
                  type="number"
                  value={form.calories}
                  onChange={(e) => setForm({ ...form, calories: +e.target.value })}
                  className="w-full rounded-lg border border-food-primary/20 bg-food-card px-3 py-1.5 text-sm text-foreground focus:border-food-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-food-muted">Protein (g)</label>
                <input
                  type="number"
                  value={form.protein}
                  onChange={(e) => setForm({ ...form, protein: +e.target.value })}
                  className="w-full rounded-lg border border-food-primary/20 bg-food-card px-3 py-1.5 text-sm text-foreground focus:border-food-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-food-muted">Carbs (g)</label>
                <input
                  type="number"
                  value={form.carbs}
                  onChange={(e) => setForm({ ...form, carbs: +e.target.value })}
                  className="w-full rounded-lg border border-food-primary/20 bg-food-card px-3 py-1.5 text-sm text-foreground focus:border-food-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-food-muted">Fat (g)</label>
                <input
                  type="number"
                  value={form.fat}
                  onChange={(e) => setForm({ ...form, fat: +e.target.value })}
                  className="w-full rounded-lg border border-food-primary/20 bg-food-card px-3 py-1.5 text-sm text-foreground focus:border-food-primary focus:outline-none"
                />
              </div>
            </div>
            <select
              value={form.mealType}
              onChange={(e) => setForm({ ...form, mealType: e.target.value as MealEntry["mealType"] })}
              className="rounded-lg border border-food-primary/20 bg-food-card px-3 py-2 text-sm text-foreground focus:border-food-primary focus:outline-none"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-food-primary px-4 py-2 text-sm font-medium text-food-primary-foreground transition-colors hover:bg-food-primary/90"
            >
              Add Entry
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-4">
        {(["breakfast", "lunch", "dinner", "snack"] as const).map((type) => {
          const entries = grouped[type]
          if (!entries || entries.length === 0) return null
          const Icon = mealIcons[type]
          return (
            <div key={type}>
              <div className="mb-2 flex items-center gap-2">
                <Icon className="h-4 w-4 text-food-primary" />
                <h4 className="text-sm font-semibold text-foreground">{mealLabels[type]}</h4>
              </div>
              <div className="flex flex-col gap-1.5">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-lg border border-food-primary/10 bg-food-bg/50 p-2.5"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{entry.name}</p>
                      <p className="text-xs text-food-muted">
                        P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{entry.calories} kcal</span>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="rounded-md p-1 text-food-muted hover:text-red-500"
                        aria-label={`Remove ${entry.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {nutrition.entries.length === 0 && (
          <p className="py-4 text-center text-sm text-food-muted">No food logged yet today</p>
        )}
      </div>
    </div>
  )
}
