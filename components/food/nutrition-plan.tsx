"use client"

import { useState } from "react"
import { useNutritionPlans, type NutritionPlan } from "@/lib/store"
import { Plus, X, ChevronDown, ChevronUp, Trash2, ClipboardList } from "lucide-react"

export function NutritionPlanCard() {
  const { plans, addPlan, updatePlan } = useNutritionPlans()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    name: "",
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 200,
    targetFat: 65,
  })

  const handleAdd = () => {
    if (!form.name.trim()) return
    addPlan({
      id: `np-${Date.now()}`,
      ...form,
      meals: [],
    })
    setForm({ name: "", targetCalories: 2000, targetProtein: 150, targetCarbs: 200, targetFat: 65 })
    setShowAdd(false)
  }

  return (
    <div className="rounded-2xl border border-food-primary/20 bg-food-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-food-primary" />
          <h3 className="font-display text-lg font-bold text-foreground">Nutrition Plans</h3>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 rounded-lg bg-food-primary px-3 py-1.5 text-xs font-medium text-food-primary-foreground transition-colors hover:bg-food-primary/90"
        >
          {showAdd ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showAdd ? "Cancel" : "New Plan"}
        </button>
      </div>

      {showAdd && (
        <div className="mt-4 rounded-xl border border-food-primary/20 bg-food-accent/30 p-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Plan name (e.g., Cut Plan)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-food-primary/20 bg-food-card px-3 py-2 text-sm text-foreground placeholder:text-food-muted focus:border-food-primary focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-food-muted">Calories</label>
                <input
                  type="number"
                  value={form.targetCalories}
                  onChange={(e) => setForm({ ...form, targetCalories: +e.target.value })}
                  className="w-full rounded-lg border border-food-primary/20 bg-food-card px-3 py-1.5 text-sm text-foreground focus:border-food-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-food-muted">Protein (g)</label>
                <input
                  type="number"
                  value={form.targetProtein}
                  onChange={(e) => setForm({ ...form, targetProtein: +e.target.value })}
                  className="w-full rounded-lg border border-food-primary/20 bg-food-card px-3 py-1.5 text-sm text-foreground focus:border-food-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-food-muted">Carbs (g)</label>
                <input
                  type="number"
                  value={form.targetCarbs}
                  onChange={(e) => setForm({ ...form, targetCarbs: +e.target.value })}
                  className="w-full rounded-lg border border-food-primary/20 bg-food-card px-3 py-1.5 text-sm text-foreground focus:border-food-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-food-muted">Fat (g)</label>
                <input
                  type="number"
                  value={form.targetFat}
                  onChange={(e) => setForm({ ...form, targetFat: +e.target.value })}
                  className="w-full rounded-lg border border-food-primary/20 bg-food-card px-3 py-1.5 text-sm text-foreground focus:border-food-primary focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-food-primary px-4 py-2 text-sm font-medium text-food-primary-foreground transition-colors hover:bg-food-primary/90"
            >
              Create Plan
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-xl border border-food-primary/10 bg-food-bg/50 overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === plan.id ? null : plan.id)}
              className="flex w-full items-center justify-between p-3.5 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                <p className="text-xs text-food-muted">{plan.targetCalories} kcal target</p>
              </div>
              {expanded === plan.id ? (
                <ChevronUp className="h-4 w-4 text-food-muted" />
              ) : (
                <ChevronDown className="h-4 w-4 text-food-muted" />
              )}
            </button>
            {expanded === plan.id && (
              <div className="border-t border-food-primary/10 p-3.5">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-food-accent/50 p-2">
                    <p className="text-lg font-bold text-foreground">{plan.targetProtein}g</p>
                    <p className="text-xs text-food-muted">Protein</p>
                  </div>
                  <div className="rounded-lg bg-food-accent/50 p-2">
                    <p className="text-lg font-bold text-foreground">{plan.targetCarbs}g</p>
                    <p className="text-xs text-food-muted">Carbs</p>
                  </div>
                  <div className="rounded-lg bg-food-accent/50 p-2">
                    <p className="text-lg font-bold text-foreground">{plan.targetFat}g</p>
                    <p className="text-xs text-food-muted">Fat</p>
                  </div>
                  <div className="rounded-lg bg-food-accent/50 p-2">
                    <p className="text-lg font-bold text-foreground">{plan.targetCalories}</p>
                    <p className="text-xs text-food-muted">Calories</p>
                  </div>
                </div>
                {plan.meals.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2">
                    {plan.meals.map((meal, i) => (
                      <div key={i} className="rounded-lg border border-food-primary/10 p-2">
                        <p className="text-sm font-medium text-foreground">{meal.name}</p>
                        <p className="text-xs text-food-muted">{meal.items.join(", ")}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
