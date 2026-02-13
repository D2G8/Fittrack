"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Dumbbell, UtensilsCrossed } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home", icon: Home, activeColor: "text-foreground" },
  { href: "/exercise", label: "Exercise", icon: Dumbbell, activeColor: "text-exercise-primary" },
  { href: "/food", label: "Nutrition", icon: UtensilsCrossed, activeColor: "text-food-primary" },
]

export function NavBar() {
  const pathname = usePathname()

  if (pathname === "/login" || pathname === "/register" || pathname === "/settings") return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-xs font-medium transition-all",
                isActive ? link.activeColor : "text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span>{link.label}</span>
              {isActive && (
                <span
                  className={cn(
                    "absolute -bottom-0 h-0.5 w-8 rounded-full",
                    pathname === "/" && "bg-foreground",
                    pathname === "/exercise" && "bg-exercise-primary",
                    pathname === "/food" && "bg-food-primary"
                  )}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
