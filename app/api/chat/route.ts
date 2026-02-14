import { generateText } from "ai"
import { z } from "zod"

// Nutrition chatbot system prompt
const SYSTEM_PROMPT = `You are a nutrition and diet expert assistant named "NutriBot". Your role is to help users with:
- Meal planning and nutrition advice
- Calorie counting and macro tracking
- Healthy eating habits and diet recommendations
- Food choices and nutritional information
- Recipe suggestions and cooking tips
- Weight management advice
- Understanding food labels and ingredients
- Sports nutrition and fitness diet

Always provide helpful, accurate, and evidence-based nutrition advice. Be friendly and encouraging. If a question is outside your nutrition expertise, politely redirect to nutrition-related topics.

When providing nutritional information, use metric units (grams, calories, etc.) by default.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Build the conversation context
    const conversationHistory = messages
      .map((msg: { role: string; content: string }) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      )
      .join('\n')

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `${SYSTEM_PROMPT}\n\nConversation:\n${conversationHistory}\n\nAssistant:`,
    })

    return Response.json({ message: text })
  } catch (error) {
    console.error("Chat error:", error)
    return Response.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    )
  }
}
