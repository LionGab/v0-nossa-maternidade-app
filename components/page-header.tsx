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
 * Header mobile-first para páginas
 * - Botão voltar funcional
 * - Botão home sempre visível em mobile
 * - Layout responsivo
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
        "sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50",
        "px-4 py-3 md:px-6 md:py-4",
        className
      )}
    >
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        {/* Botão voltar - sempre visível em mobile */}
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 touch-feedback shrink-0 md:hidden"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Ícone e título */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {icon && (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground truncate">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground truncate">{description}</p>
            )}
          </div>
        </div>

        {/* Botão home - sempre visível em mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard")}
          className="h-10 w-10 touch-feedback shrink-0"
          aria-label="Ir para home"
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
