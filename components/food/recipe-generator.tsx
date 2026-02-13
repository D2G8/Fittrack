"use client"

import { useState } from "react"
import { ChefHat, Loader2, DollarSign, Clock, Users, Flame, X } from "lucide-react"

interface Recipe {
  name: string
  description: string
  servings: number
  prepTime: string
  cookTime: string
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: { item: string; amount: string }[]
  instructions: string[]
  estimatedCost: string
}

export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("")
  const [budget, setBudget] = useState("")
  const [dietaryPreferences, setDietaryPreferences] = useState("")
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!ingredients.trim()) return
    setLoading(true)
    setError("")
    setRecipe(null)

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, budget, dietaryPreferences }),
      })

      if (!res.ok) throw new Error("Failed to generate recipe")

      const data = await res.json()
      setRecipe(data.recipe)
    } catch {
      setError("Failed to generate recipe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-food-primary/20 bg-food-card p-5">
      <div className="flex items-center gap-2">
        <ChefHat className="h-5 w-5 text-food-primary" />
        <h3 className="font-display text-lg font-bold text-foreground">Recipe Generator</h3>
      </div>
      <p className="mt-1 text-xs text-food-muted">Enter your ingredients and budget to generate a recipe</p>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-food-muted">Ingredients (comma separated)</label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken breast, rice, broccoli, garlic, olive oil"
            rows={3}
            className="w-full rounded-lg border border-food-primary/20 bg-food-card px-3 py-2 text-sm text-foreground placeholder:text-food-muted focus:border-food-primary focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-food-muted">Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g., $15"
              className="w-full rounded-lg border border-food-primary/20 bg-food-card px-3 py-2 text-sm text-foreground placeholder:text-food-muted focus:border-food-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-food-muted">Diet (optional)</label>
            <input
              type="text"
              value={dietaryPreferences}
              onChange={(e) => setDietaryPreferences(e.target.value)}
              placeholder="e.g., high-protein"
              className="w-full rounded-lg border border-food-primary/20 bg-food-card px-3 py-2 text-sm text-foreground placeholder:text-food-muted focus:border-food-primary focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !ingredients.trim()}
          className="flex items-center justify-center gap-2 rounded-lg bg-food-primary px-4 py-2.5 text-sm font-medium text-food-primary-foreground transition-colors hover:bg-food-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ChefHat className="h-4 w-4" />
              Generate Recipe
            </>
          )}
        </button>

        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}
      </div>

      {recipe && (
        <div className="mt-5 rounded-xl border border-food-primary/20 bg-food-bg/50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-display text-lg font-bold text-foreground">{recipe.name}</h4>
              <p className="mt-1 text-sm text-food-muted">{recipe.description}</p>
            </div>
            <button
              onClick={() => setRecipe(null)}
              className="rounded-md p-1 text-food-muted hover:text-foreground"
              aria-label="Close recipe"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center rounded-lg bg-food-accent/50 p-2">
              <Clock className="h-3.5 w-3.5 text-food-primary" />
              <span className="mt-1 text-xs font-semibold text-foreground">{recipe.prepTime}</span>
              <span className="text-[10px] text-food-muted">Prep</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-food-accent/50 p-2">
              <Clock className="h-3.5 w-3.5 text-food-primary" />
              <span className="mt-1 text-xs font-semibold text-foreground">{recipe.cookTime}</span>
              <span className="text-[10px] text-food-muted">Cook</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-food-accent/50 p-2">
              <Users className="h-3.5 w-3.5 text-food-primary" />
              <span className="mt-1 text-xs font-semibold text-foreground">{recipe.servings}</span>
              <span className="text-[10px] text-food-muted">Servings</span>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-food-accent/50 p-2">
              <DollarSign className="h-3.5 w-3.5 text-food-primary" />
              <span className="mt-1 text-xs font-semibold text-foreground">{recipe.estimatedCost}</span>
              <span className="text-[10px] text-food-muted">Cost</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-food-accent/30 p-1.5">
              <p className="text-sm font-bold text-foreground">{recipe.calories}</p>
              <p className="text-[10px] text-food-muted">kcal</p>
            </div>
            <div className="rounded-lg bg-food-accent/30 p-1.5">
              <p className="text-sm font-bold text-foreground">{recipe.protein}g</p>
              <p className="text-[10px] text-food-muted">Protein</p>
            </div>
            <div className="rounded-lg bg-food-accent/30 p-1.5">
              <p className="text-sm font-bold text-foreground">{recipe.carbs}g</p>
              <p className="text-[10px] text-food-muted">Carbs</p>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="text-sm font-semibold text-foreground">Ingredients</h5>
            <ul className="mt-2 flex flex-col gap-1">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-food-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-food-primary" />
                  <span className="font-medium text-foreground">{ing.amount}</span> {ing.item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h5 className="text-sm font-semibold text-foreground">Instructions</h5>
            <ol className="mt-2 flex flex-col gap-2">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-food-primary text-xs font-bold text-food-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-food-muted">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
