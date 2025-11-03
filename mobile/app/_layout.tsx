/**
 * Nossa Maternidade Mobile App
 * Aplicativo mobile-first para iOS e Android
 * 
 * Layout principal com navegação por tabs
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Mantém a splash screen visível enquanto carregamos os recursos
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Simula carregamento de recursos
    const prepare = async () => {
      try {
        // Aqui você pode carregar fontes, dados, etc.
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Esconde a splash screen
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
