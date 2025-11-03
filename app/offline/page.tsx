"use client"

import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f0ff] via-[#fff5f7] to-[#f0f9ff]">
      <div className="max-w-md mx-auto px-6 text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-[#C8A2D0]" />
          </div>
        </div>

        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
          Você está offline
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Parece que você perdeu a conexão com a internet. Conecte-se novamente para continuar usando o app.
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">O que você pode fazer:</h2>
          <ul className="text-left space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#C8A2D0] mt-1">✓</span>
              <span>Verifique sua conexão Wi-Fi ou dados móveis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C8A2D0] mt-1">✓</span>
              <span>Tente recarregar a página quando estiver online</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C8A2D0] mt-1">✓</span>
              <span>Algumas funcionalidades podem funcionar offline</span>
            </li>
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gradient-to-r from-[#C8A2D0] to-[#E8B4D6] text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
        >
          Tentar Novamente
        </button>

        <p className="mt-6 text-sm text-gray-500">
          Nossa Maternidade - Sempre ao seu lado
        </p>
      </div>
    </div>
  )
}
