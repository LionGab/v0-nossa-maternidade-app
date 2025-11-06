"use client"

import { ErrorBoundary } from "@/components/error-boundary"
import type { ReactNode } from "react"

interface ErrorBoundaryWrapperProps {
  children: ReactNode
}

export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
