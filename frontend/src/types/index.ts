export * from './issue';
export * from './user';
export * from './settings';
export * from './dashboard';
export * from './forms';

// Common utility types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ViewMode = 'list' | 'grid' | 'card';