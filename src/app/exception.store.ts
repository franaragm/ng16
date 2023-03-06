import { InjectionToken, SettableSignal, signal } from '@angular/core';

export type Exception = {
  message: string;
  category: string;
  timestamp: Date;
};

export const EXCEPTION_STORE
  = new InjectionToken<SettableSignal<Exception | null>>(
    'EXCEPTION_STORE', {
      providedIn: 'root',
      factory: () => signal<Exception | null>(null),
    });
