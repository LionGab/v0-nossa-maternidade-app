/**
 * Test Helpers and Utilities
 * 
 * Common utilities for testing React components and hooks.
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Create a new QueryClient for testing
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Wrapper component with all necessary providers for testing
 */
interface TestProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export function TestProviders({ children, queryClient }: TestProvidersProps) {
  const client = queryClient || createTestQueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Custom render function that includes all providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    queryClient?: QueryClient;
  }
) {
  const { queryClient, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders queryClient={queryClient}>{children}</TestProviders>
    ),
    ...renderOptions,
  });
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean,
  timeout = 5000,
  interval = 50
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Create a mock function with TypeScript support
 */
export function createMockFn<T extends (...args: any[]) => any>() {
  const fn = vi.fn() as any;
  return fn as unknown as {
    (...args: Parameters<T>): ReturnType<T>;
    mockReturnValue: (value: ReturnType<T>) => any;
    mockResolvedValue: (value: ReturnType<T>) => any;
    mockImplementation: (impl: T) => any;
  };
}

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'patient' as const,
};

/**
 * Mock patient data for testing
 */
export const mockPatient = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  firstName: 'Maria',
  lastName: 'Silva',
  birthDate: '1990-05-15',
  gender: 'female' as const,
  phone: '+5511999999999',
  email: 'maria@example.com',
  address: {
    street: 'Rua Exemplo',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    country: 'BR',
  },
  emergencyContact: {
    relationship: 'partner' as const,
    name: 'João Silva',
    phone: '+5511988888888',
  },
  bloodType: 'O+' as const,
  allergies: [],
  chronicConditions: [],
  isPregnant: true,
  estimatedDueDate: '2025-03-15',
  gestationalAge: 20,
  active: true,
};

/**
 * Mock appointment data for testing
 */
export const mockAppointment = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  status: 'booked' as const,
  appointmentType: 'prenatal' as const,
  startDateTime: '2025-02-15T10:00:00Z',
  endDateTime: '2025-02-15T11:00:00Z',
  duration: 60,
  patientId: mockPatient.id,
  practitionerId: '123e4567-e89b-12d3-a456-426614174003',
  reason: 'Consulta pré-natal de rotina',
  locationName: 'Clínica Exemplo',
};

/**
 * Mock observation data for testing
 */
export const mockObservation = {
  id: '123e4567-e89b-12d3-a456-426614174004',
  status: 'final' as const,
  code: 'blood-pressure',
  display: 'Pressão Arterial',
  category: 'vital-signs' as const,
  valueQuantity: {
    value: 120,
    unit: 'mmHg',
  },
  patientId: mockPatient.id,
  effectiveDateTime: '2025-01-15T09:00:00Z',
  interpretation: 'normal' as const,
};

/**
 * Helper to create a mock fetch response
 */
export function createMockResponse<T>(data: T, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    blob: async () => new Blob([JSON.stringify(data)]),
    arrayBuffer: async () => new ArrayBuffer(0),
    headers: new Headers(),
    redirected: false,
    statusText: ok ? 'OK' : 'Error',
    type: 'basic' as ResponseType,
    url: '',
    clone: function () {
      return this;
    },
    body: null,
    bodyUsed: false,
    formData: async () => new FormData(),
  } as Response;
}

/**
 * Helper to create a rejected promise
 */
export function createRejectedPromise(error: Error) {
  return Promise.reject(error);
}

/**
 * Helper to simulate async delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Re-export commonly used testing utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
