import { InjectionToken, SettableSignal, signal } from '@angular/core';

export type Exception = {
  message: string;
  category: string;
  timestamp: Date;
};

export const EXCEPTION_SIGNAL = new InjectionToken<
  SettableSignal<Exception | null>
>('EXCEPTION_SIGNAL', {
  providedIn: 'root',
  factory: () => signal<Exception | null>(null),
});
