"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Lightbulb, Baby, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/dashboard",
    label: "Início",
    icon: Home,
  },
  {
    href: "/rotina",
    label: "Rotina",
    icon: Calendar,
  },
  {
    href: "/autocuidado",
    label: "Autocuidado",
    icon: Heart,
  },
  {
    href: "/brincadeiras",
    label: "Dicas",
    icon: Lightbulb,
  },
  {
    href: "/perfil-bebe",
    label: "Bebê",
    icon: Baby,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
