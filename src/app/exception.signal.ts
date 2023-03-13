import { InjectionToken, SettableSignal, signal } from '@angular/core';

/**
 * Exception data
 */
export type Exception = {
  message: string;
  category: string;
  timestamp: number;
};

/**
 * Exception Signal (nullable for easy initializing or resetting)
 */
type ExceptionSignal = SettableSignal<Exception | null>;

/**
 * Exception Signal provided as an injectable token
 */
export const EXCEPTION_SIGNAL = new InjectionToken<ExceptionSignal>(
  'EXCEPTION_SIGNAL',
  {
    providedIn: 'root',
    factory: () => signal<Exception | null>(null),
  }
);
