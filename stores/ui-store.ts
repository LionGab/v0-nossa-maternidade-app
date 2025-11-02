/**
 * UI Store
 * 
 * Global state management for UI-related state using Zustand.
 * Handles modals, sidebars, notifications, and other UI components.
 */

import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  // Modals
  activeModal: string | null;
  modalData: Record<string, any>;

  // Toasts
  toasts: Toast[];

  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;

  // Actions - Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;

  // Actions - Modals
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;
  setModalData: (data: Record<string, any>) => void;

  // Actions - Toasts
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Actions - Loading
  setGlobalLoading: (isLoading: boolean) => void;
  setLoadingState: (key: string, isLoading: boolean) => void;
  clearLoadingStates: () => void;
}

/**
 * UI store for managing application UI state
 */
export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  activeModal: null,
  modalData: {},
  toasts: [],
  globalLoading: false,
  loadingStates: {},

  // Sidebar actions
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleSidebarCollapsed: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (isCollapsed) => set({ isSidebarCollapsed: isCollapsed }),

  // Modal actions
  openModal: (modalId, data = {}) => set({ activeModal: modalId, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: {} }),
  setModalData: (data) => set({ modalData: data }),

  // Toast actions
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, ...toast };
    
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto-remove toast after duration (default 5 seconds)
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((toast) => toast.id !== id),
  })),

  clearToasts: () => set({ toasts: [] }),

  // Loading actions
  setGlobalLoading: (isLoading) => set({ globalLoading: isLoading }),
  
  setLoadingState: (key, isLoading) => set((state) => ({
    loadingStates: { ...state.loadingStates, [key]: isLoading },
  })),

  clearLoadingStates: () => set({ loadingStates: {} }),
}));
