import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
  xl: "w-16 h-16 border-4",
}

export function LoadingSpinner({ size = "md", className, ...props }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-primary border-r-transparent",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
    </div>
  )
}
