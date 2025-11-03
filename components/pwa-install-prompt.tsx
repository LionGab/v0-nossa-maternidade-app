'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Download } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user previously dismissed
    const wasDismissed = localStorage.getItem('pwa-install-dismissed')
    if (wasDismissed) {
      setDismissed(true)
      return
    }

    // Show prompt after 5 seconds if installable
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled) {
        setShowPrompt(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [isInstallable, isInstalled])

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  const handleInstall = async () => {
    await promptInstall()
    setShowPrompt(false)
  }

  if (!showPrompt || dismissed || isInstalled || !isInstallable) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 md:left-auto md:right-4 md:max-w-sm">
      <Card className="p-4 shadow-lg border-2 border-primary/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              📱
            </div>
            <div>
              <h3 className="font-semibold text-sm">Instalar App</h3>
              <p className="text-xs text-muted-foreground">
                Acesso rápido e offline
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <Button
            onClick={handleInstall}
            className="w-full touch-feedback"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Instalar Nossa Maternidade
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Funciona offline e recebe notificações
          </p>
        </div>
      </Card>
    </div>
  )
}
