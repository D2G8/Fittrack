"use client"

import { NavBar } from "@/components/nav-bar"
import { CalorieTracker } from "@/components/food/calorie-tracker"
import { WeightGoal } from "@/components/food/weight-goal"
import { FoodLog } from "@/components/food/food-log"
import { NutritionPlanCard } from "@/components/food/nutrition-plan"
import { RecipeGenerator } from "@/components/food/recipe-generator"
import { UtensilsCrossed } from "lucide-react"

export default function FoodPage() {
  return (
    <div className="min-h-screen bg-food-bg pb-24">
      <header className="sticky top-0 z-40 border-b border-food-primary/10 bg-food-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-food-primary">
            <UtensilsCrossed className="h-4 w-4 text-food-primary-foreground" />
          </div>
          <h1 className="font-display text-xl font-bold text-foreground">Nutrition</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="flex flex-col gap-5">
          <CalorieTracker />
          <WeightGoal />
          <FoodLog />
          <NutritionPlanCard />
          <RecipeGenerator />
        </div>
      </main>

      <NavBar />
    </div>
  )
}
