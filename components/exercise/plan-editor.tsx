"use client"

import { useState } from "react"
import { useExercisePlans, type ExercisePlan, type Exercise } from "@/lib/store"
import { Plus, Pencil, Trash2, X, Save, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"



const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const BODY_PARTS = ["chest", "back", "shoulders", "arms", "legs", "core"]

export function PlanEditor() {
  const { plans, addPlan, updatePlan, deletePlan } = useExercisePlans()
  console.log(plans)
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPlan, setNewPlan] = useState({ name: "", dayOfWeek: "Monday" })
  const [newExercise, setNewExercise] = useState({ name: "", sets: 3, reps: 10, weight: 0, bodyPart: "chest" })

  const handleAddPlan = () => {
    if (!newPlan.name.trim()) return
    addPlan({
      id: `p-${Date.now()}`,
      name: newPlan.name,
      dayOfWeek: newPlan.dayOfWeek,
      exercises: [],
    })
    setNewPlan({ name: "", dayOfWeek: "Monday" })
    setShowAddForm(false)
  }

  const handleAddExercise = (planId: string) => {
    if (!newExercise.name.trim()) return
    const plan = plans.find((p) => p.id === planId)
    if (!plan) return

    const exercise: Exercise = {
      id: `e-${Date.now()}`,
      name: newExercise.name,
      sets: newExercise.sets,
      reps: newExercise.reps,
      weight: newExercise.weight,
      bodyPart: newExercise.bodyPart,
      completed: false,
    }

    updatePlan(planId, { exercises: [...plan.exercises, exercise] })
    setNewExercise({ name: "", sets: 3, reps: 10, weight: 0, bodyPart: "chest" })
  }

  const handleRemoveExercise = (planId: string, exerciseId: string) => {
    const plan = plans.find((p) => p.id === planId)
    if (!plan) return
    updatePlan(planId, { exercises: plan.exercises.filter((e) => e.id !== exerciseId) })
  }

  return (
    <div className="rounded-2xl border border-exercise-primary/20 bg-exercise-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">Exercise Plans</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 rounded-lg bg-exercise-primary px-3 py-1.5 text-xs font-medium text-exercise-primary-foreground transition-colors hover:bg-exercise-primary/90"
        >
          {showAddForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {showAddForm ? "Cancel" : "Add Plan"}
        </button>
      </div>

      {showAddForm && (
        <div className="mt-4 rounded-xl border border-exercise-primary/20 bg-exercise-accent/30 p-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Plan name (e.g., Push Day)"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              className="rounded-lg border border-exercise-primary/20 bg-exercise-card px-3 py-2 text-sm text-foreground placeholder:text-exercise-muted focus:border-exercise-primary focus:outline-none"
            />
            <select
              value={newPlan.dayOfWeek}
              onChange={(e) => setNewPlan({ ...newPlan, dayOfWeek: e.target.value })}
              className="rounded-lg border border-exercise-primary/20 bg-exercise-card px-3 py-2 text-sm text-foreground focus:border-exercise-primary focus:outline-none"
            >
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <button
              onClick={handleAddPlan}
              className="rounded-lg bg-exercise-primary px-4 py-2 text-sm font-medium text-exercise-primary-foreground transition-colors hover:bg-exercise-primary/90"
            >
              Create Plan
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-xl border border-exercise-primary/10 bg-exercise-bg/50 overflow-hidden"
          >
            <div
              onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
              className="flex w-full items-center justify-between p-3.5 text-left cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                <p className="text-xs text-exercise-muted">
                  {plan.dayOfWeek} - {plan.exercises.length} exercises
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); deletePlan(plan.id) }}
                  className="rounded-md p-1 text-exercise-muted hover:bg-exercise-accent hover:text-red-500"
                  aria-label={`Delete ${plan.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                {expandedPlan === plan.id ? (
                  <ChevronUp className="h-4 w-4 text-exercise-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-exercise-muted" />
                )}
              </div>
            </div>

            {expandedPlan === plan.id && (
              <div className="border-t border-exercise-primary/10 p-3.5">
                {plan.exercises.map((ex) => (
                  <div key={ex.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-exercise-accent/30">
                    <div>
                      <p className="text-sm font-medium text-foreground">{ex.name}</p>
                      <p className="text-xs text-exercise-muted">
                        {ex.sets}x{ex.reps} @ {ex.weight}kg - <span className="capitalize">{ex.bodyPart}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveExercise(plan.id, ex.id)}
                      className="rounded-md p-1 text-exercise-muted hover:text-red-500"
                      aria-label={`Remove ${ex.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <div className="mt-3 rounded-lg border border-dashed border-exercise-primary/20 p-3">
                  <p className="mb-2 text-xs font-medium text-exercise-muted">Add Exercise</p>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Exercise name"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      className="rounded-lg border border-exercise-primary/20 bg-exercise-card px-3 py-1.5 text-sm text-foreground placeholder:text-exercise-muted focus:border-exercise-primary focus:outline-none"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="Sets"
                        value={newExercise.sets}
                        onChange={(e) => setNewExercise({ ...newExercise, sets: +e.target.value })}
                        className="rounded-lg border border-exercise-primary/20 bg-exercise-card px-3 py-1.5 text-sm text-foreground focus:border-exercise-primary focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        value={newExercise.reps}
                        onChange={(e) => setNewExercise({ ...newExercise, reps: +e.target.value })}
                        className="rounded-lg border border-exercise-primary/20 bg-exercise-card px-3 py-1.5 text-sm text-foreground focus:border-exercise-primary focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Weight (kg)"
                        value={newExercise.weight}
                        onChange={(e) => setNewExercise({ ...newExercise, weight: +e.target.value })}
                        className="rounded-lg border border-exercise-primary/20 bg-exercise-card px-3 py-1.5 text-sm text-foreground focus:border-exercise-primary focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={newExercise.bodyPart}
                        onChange={(e) => setNewExercise({ ...newExercise, bodyPart: e.target.value })}
                        className="flex-1 rounded-lg border border-exercise-primary/20 bg-exercise-card px-3 py-1.5 text-sm text-foreground focus:border-exercise-primary focus:outline-none"
                      >
                        {BODY_PARTS.map((bp) => (
                          <option key={bp} value={bp} className="capitalize">{bp}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAddExercise(plan.id)}
                        className="rounded-lg bg-exercise-primary px-3 py-1.5 text-sm font-medium text-exercise-primary-foreground hover:bg-exercise-primary/90"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
