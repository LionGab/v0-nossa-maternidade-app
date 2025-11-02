/**
 * Supabase Mock
 * 
 * Mock implementation of Supabase client for testing.
 */

import { vi } from 'vitest';

/**
 * Mock Supabase client response builder
 */
export class SupabaseMockBuilder {
  private mockData: any = null;
  private mockError: any = null;
  private mockCount: number | null = null;

  data(data: any) {
    this.mockData = data;
    return this;
  }

  error(error: any) {
    this.mockError = error;
    return this;
  }

  count(count: number) {
    this.mockCount = count;
    return this;
  }

  build() {
    return {
      data: this.mockData,
      error: this.mockError,
      count: this.mockCount,
    };
  }
}

/**
 * Create a mock Supabase query builder
 */
export function createMockQueryBuilder(
  initialData: any = [],
  initialError: any = null
) {
  const builder = {
    data: initialData,
    error: initialError,
    count: null as number | null,

    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),

    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    rangeLt: vi.fn().mockReturnThis(),
    rangeGt: vi.fn().mockReturnThis(),
    rangeGte: vi.fn().mockReturnThis(),
    rangeLte: vi.fn().mockReturnThis(),
    rangeAdjacent: vi.fn().mockReturnThis(),
    overlaps: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),

    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnValue({
      data: builder.data,
      error: builder.error,
    }),
    maybeSingle: vi.fn().mockReturnValue({
      data: builder.data,
      error: builder.error,
    }),

    then: vi.fn((resolve) =>
      resolve({
        data: builder.data,
        error: builder.error,
        count: builder.count,
      })
    ),
  };

  return builder;
}

/**
 * Create a mock Supabase client
 */
export function createMockSupabaseClient(options?: {
  selectData?: any;
  selectError?: any;
  insertData?: any;
  insertError?: any;
  updateData?: any;
  updateError?: any;
  deleteData?: any;
  deleteError?: any;
}) {
  const {
    selectData = [],
    selectError = null,
    insertData = null,
    insertError = null,
    updateData = null,
    updateError = null,
    deleteData = null,
    deleteError = null,
  } = options || {};

  return {
    from: vi.fn((table: string) => ({
      select: vi.fn(() => createMockQueryBuilder(selectData, selectError)),
      insert: vi.fn(() => createMockQueryBuilder(insertData, insertError)),
      update: vi.fn(() => createMockQueryBuilder(updateData, updateError)),
      delete: vi.fn(() => createMockQueryBuilder(deleteData, deleteError)),
    })),

    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },

    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        download: vi.fn().mockResolvedValue({ data: null, error: null }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
        list: vi.fn().mockResolvedValue({ data: [], error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/file.jpg' },
        }),
      })),
    },

    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      unsubscribe: vi.fn().mockReturnThis(),
    })),

    removeChannel: vi.fn(),
  };
}

/**
 * Mock Supabase auth user
 */
export const mockAuthUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  email_confirmed_at: '2024-01-01T00:00:00Z',
  app_metadata: {},
  user_metadata: {
    firstName: 'Test',
    lastName: 'User',
  },
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
  role: 'authenticated',
};

/**
 * Mock Supabase session
 */
export const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() / 1000 + 3600,
  token_type: 'bearer',
  user: mockAuthUser,
};
