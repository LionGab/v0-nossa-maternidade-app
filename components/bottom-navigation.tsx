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
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 md:hidden elevation-lg"
      aria-label="Navegação principal"
    >
      {/* Safe area para notches (iPhone X+) - WCAG 2.1 AA */}
      <div className="safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all touch-feedback min-h-[44px] min-w-[44px] flex-1",
                  "hover:bg-primary/5 active:scale-95",
                  isActive
                    ? "text-primary bg-primary/15 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-all",
                  isActive && "fill-primary/20 scale-110 drop-shadow-sm"
                )} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
