// Setup Vitest para React Native/Expo
// Mocka APIs nativas do React Native que não existem no ambiente de teste

import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react-native"

// Mock do React Native AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve(null)),
    clear: jest.fn(() => Promise.resolve(null)),
    getAllKeys: jest.fn(() => Promise.resolve([])),
  },
}))

// Mock do Expo Router (se estiver usando)
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
  usePathname: () => "/",
  Link: "Link",
  Stack: {
    Screen: "Screen",
  },
}))

// Mock do Expo Constants
jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
      },
    },
  },
}))

// Mock do React Native Platform
jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  OS: "ios",
  select: (obj: any) => obj.ios,
  Version: 13,
}))

// Mock do Animated API
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper", () => ({
  __esModule: true,
  default: {
    API: {
      createAnimatedComponent: (component: any) => component,
    },
  },
}))

// Cleanup após cada teste
afterEach(() => {
  cleanup()
})

// Setup global para testes
global.requestAnimationFrame = (cb: FrameRequestCallback) => {
  setTimeout(cb, 0)
}

// Mock do console.warn para evitar warnings de testes
const originalWarn = console.warn
console.warn = (...args: any[]) => {
  // Ignorar warnings específicos do React Native durante testes
  if (
    args[0]?.includes?.("React Native") ||
    args[0]?.includes?.("VirtualizedList")
  ) {
    return
  }
  originalWarn(...args)
}
