'use client'

import { useEffect, useState } from 'react'
import { clientLogger } from '@/lib/logger-client'

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isStandalone: boolean
  promptInstall: () => void
}

export function usePWA(): PWAState {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Verificar se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    setIsInstalled(isStandalone)

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          clientLogger.info('Service Worker registrado com sucesso', { scope: registration.scope })
        })
        .catch((error) => {
          clientLogger.error('Erro ao registrar Service Worker', error)
        })
    }

    // Evento de instalação disponível
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
      clientLogger.info('PWA instalação disponível')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Detectar quando foi instalado
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setIsInstallable(false)
      clientLogger.info('PWA instalado com sucesso')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    clientLogger.info('Resposta do usuário ao prompt de instalação', { outcome })
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  return {
    isInstallable,
    isInstalled,
    isStandalone: isInstalled,
    promptInstall,
  }
}
