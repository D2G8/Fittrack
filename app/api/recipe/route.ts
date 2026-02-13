import { generateText, Output } from "ai"
import { z } from "zod"

const recipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  servings: z.number(),
  prepTime: z.string(),
  cookTime: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  ingredients: z.array(z.object({
    item: z.string(),
    amount: z.string(),
  })),
  instructions: z.array(z.string()),
  estimatedCost: z.string(),
})

export async function POST(req: Request) {
  const { ingredients, budget, dietaryPreferences } = await req.json()

  const { output } = await generateText({
    model: "openai/gpt-4o-mini",
    output: Output.object({ schema: recipeSchema }),
    prompt: `Generate a healthy recipe based on these constraints:
    
Available ingredients: ${ingredients}
Budget: ${budget}
${dietaryPreferences ? `Dietary preferences: ${dietaryPreferences}` : ""}

Create a nutritious, budget-friendly recipe that uses the provided ingredients. Include accurate nutritional information and cost estimates. Make it practical and easy to follow.`,
  })

  return Response.json({ recipe: output })
}
