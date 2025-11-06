"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  showBack?: boolean
  backHref?: string
  className?: string
}

/**
 * Header mobile-first para páginas - Design System Enhanced
 * - Botão voltar funcional com touch feedback
 * - Botão home sempre visível em mobile
 * - Layout responsivo com safe area
 * - Glass morphism e elevação moderna
 * - WCAG 2.1 AA compliant (touch targets 44x44px)
 */
export function PageHeader({
  title,
  description,
  icon,
  showBack = true,
  backHref,
  className,
}: PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-20 glass border-b border-border/50 elevation-md safe-area-top",
        "px-4 py-3 md:px-6 md:py-4",
        className
      )}
    >
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        {/* Botão voltar - WCAG 2.1 AA compliant */}
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-11 w-11 touch-feedback shrink-0 hover-scale"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Ícone e título */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {icon && (
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 text-primary elevation-xs">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground truncate">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {/* Botão home - sempre visível com feedback */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
          className="h-11 w-11 touch-feedback shrink-0 hover-scale"
          aria-label="Ir para home"
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
