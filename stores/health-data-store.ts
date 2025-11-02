/**
 * Health Data Store
 * 
 * Global state management for health-related data using Zustand.
 * Handles patient data, appointments, observations, and pregnancy tracking.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  Patient, 
  Appointment, 
  Observation, 
  PregnancyTracking 
} from '@/lib/schemas/health-schemas';

// Constants
const MAX_RECENT_APPOINTMENTS = 10;
const MAX_RECENT_OBSERVATIONS = 20;

interface HealthDataState {
  // Patient data
  patient: Patient | null;
  
  // Recent appointments
  recentAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  
  // Recent observations (vital signs, lab results)
  recentObservations: Observation[];
  
  // Pregnancy tracking
  pregnancyTracking: PregnancyTracking | null;
  
  // Sync state
  lastSync: string | null;
  isSyncing: boolean;

  // Actions - Patient
  setPatient: (patient: Patient | null) => void;
  updatePatient: (updates: Partial<Patient>) => void;

  // Actions - Appointments
  setRecentAppointments: (appointments: Appointment[]) => void;
  setUpcomingAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  removeAppointment: (id: string) => void;

  // Actions - Observations
  setRecentObservations: (observations: Observation[]) => void;
  addObservation: (observation: Observation) => void;

  // Actions - Pregnancy Tracking
  setPregnancyTracking: (tracking: PregnancyTracking | null) => void;
  updatePregnancyTracking: (updates: Partial<PregnancyTracking>) => void;

  // Actions - Sync
  setLastSync: (timestamp: string) => void;
  setSyncing: (isSyncing: boolean) => void;
  
  // Reset
  reset: () => void;
}

/**
 * Health data store with persistence
 */
export const useHealthDataStore = create<HealthDataState>()(
  persist(
    (set, get) => ({
      // Initial state
      patient: null,
      recentAppointments: [],
      upcomingAppointments: [],
      recentObservations: [],
      pregnancyTracking: null,
      lastSync: null,
      isSyncing: false,

      // Patient actions
      setPatient: (patient) => set({ patient }),
      
      updatePatient: (updates) => {
        const currentPatient = get().patient;
        if (currentPatient) {
          set({ patient: { ...currentPatient, ...updates } });
        }
      },

      // Appointment actions
      setRecentAppointments: (appointments) => set({ recentAppointments: appointments }),
      
      setUpcomingAppointments: (appointments) => set({ upcomingAppointments: appointments }),
      
      addAppointment: (appointment) => {
        const now = new Date();
        const appointmentDate = new Date(appointment.startDateTime);
        
        if (appointmentDate > now) {
          // Future appointment - add to upcoming
          set((state) => ({
            upcomingAppointments: [...state.upcomingAppointments, appointment]
              .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()),
          }));
        } else {
          // Past appointment - add to recent
          set((state) => ({
            recentAppointments: [appointment, ...state.recentAppointments]
              .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())
              .slice(0, MAX_RECENT_APPOINTMENTS),
          }));
        }
      },
      
      updateAppointment: (id, updates) => {
        set((state) => ({
          recentAppointments: state.recentAppointments.map((apt) =>
            apt.id === id ? { ...apt, ...updates } : apt
          ),
          upcomingAppointments: state.upcomingAppointments.map((apt) =>
            apt.id === id ? { ...apt, ...updates } : apt
          ),
        }));
      },
      
      removeAppointment: (id) => {
        set((state) => ({
          recentAppointments: state.recentAppointments.filter((apt) => apt.id !== id),
          upcomingAppointments: state.upcomingAppointments.filter((apt) => apt.id !== id),
        }));
      },

      // Observation actions
      setRecentObservations: (observations) => set({ recentObservations: observations }),
      
      addObservation: (observation) => {
        set((state) => ({
          recentObservations: [observation, ...state.recentObservations]
            .sort((a, b) => new Date(b.effectiveDateTime).getTime() - new Date(a.effectiveDateTime).getTime())
            .slice(0, MAX_RECENT_OBSERVATIONS),
        }));
      },

      // Pregnancy tracking actions
      setPregnancyTracking: (tracking) => set({ pregnancyTracking: tracking }),
      
      updatePregnancyTracking: (updates) => {
        const current = get().pregnancyTracking;
        if (current) {
          set({ pregnancyTracking: { ...current, ...updates } });
        }
      },

      // Sync actions
      setLastSync: (timestamp) => set({ lastSync: timestamp }),
      setSyncing: (isSyncing) => set({ isSyncing }),

      // Reset
      reset: () => set({
        patient: null,
        recentAppointments: [],
        upcomingAppointments: [],
        recentObservations: [],
        pregnancyTracking: null,
        lastSync: null,
        isSyncing: false,
      }),
    }),
    {
      name: 'health-data-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        patient: state.patient,
        recentAppointments: state.recentAppointments,
        upcomingAppointments: state.upcomingAppointments,
        recentObservations: state.recentObservations,
        pregnancyTracking: state.pregnancyTracking,
        lastSync: state.lastSync,
      }),
    }
  )
);
