"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send, X, Loader2, Bot, User } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function NutritionChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm NutriBot, your nutrition assistant. Ask me anything about healthy eating, meal planning, calories, macros, or any nutrition-related topic!"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (!res.ok) throw new Error("Failed to get response")

      const data = await res.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Floating button when chat is closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-food-primary shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
        aria-label="Open nutrition chat"
      >
        <MessageCircle className="h-6 w-6 text-food-primary-foreground" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 w-80 sm:w-96">
      <div className="flex h-[500px] flex-col rounded-2xl border border-food-primary/20 bg-food-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-food-primary px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-food-primary-foreground/20">
              <Bot className="h-5 w-5 text-food-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-food-primary-foreground">NutriBot</h3>
              <p className="text-[10px] text-food-primary-foreground/70">AI Nutrition Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-food-primary-foreground/70 hover:bg-food-primary-foreground/20 hover:text-food-primary-foreground"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[85%] items-start gap-2 rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-food-primary text-food-primary-foreground"
                      : "bg-food-accent text-foreground"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Bot className="mt-0.5 h-4 w-4 shrink-0 text-food-primary" />
                  )}
                  {message.role === "user" && (
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-food-primary-foreground" />
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] items-center gap-2 rounded-2xl bg-food-accent px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-food-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-food-primary/20 p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about nutrition..."
              className="flex-1 rounded-lg border border-food-primary/20 bg-food-bg px-3 py-2 text-sm text-foreground placeholder:text-food-muted focus:border-food-primary focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-food-primary text-food-primary-foreground transition-colors hover:bg-food-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
