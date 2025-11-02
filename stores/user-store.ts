/**
 * User Store
 * 
 * Global state management for user data using Zustand.
 * Handles user authentication state, profile data, and preferences.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: 'patient' | 'practitioner' | 'admin';
  isPregnant?: boolean;
  estimatedDueDate?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    appointments: boolean;
    health: boolean;
    community: boolean;
  };
}

interface UserState {
  // State
  user: User | null;
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'pt-BR',
  notifications: {
    email: true,
    push: true,
    appointments: true,
    health: true,
    community: true,
  },
};

/**
 * User store with persistence
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      preferences: defaultPreferences,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, error: null }),
      
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates }, error: null });
        }
      },

      setPreferences: (updates) => {
        const currentPreferences = get().preferences;
        set({ 
          preferences: { 
            ...currentPreferences, 
            ...updates,
            notifications: {
              ...currentPreferences.notifications,
              ...(updates.notifications || {}),
            },
          } 
        });
      },

      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),

      reset: () => set({
        user: null,
        preferences: defaultPreferences,
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        preferences: state.preferences,
      }),
    }
  )
);
