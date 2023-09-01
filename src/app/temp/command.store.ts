import { signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

export type CommandStatus = 'idle' | 'working' | 'completed' | 'failed';

export interface CommandState<T> {
  readonly result: T;
  readonly error: object | null;
  readonly status: CommandStatus;
}

export class CommandStore<T> {
  #subscription!: Subscription;
  #state = signal<CommandState<T>>({
    result: this.init,
    error: null,
    status: 'idle',
  });

  readonly state = this.#state.asReadonly();

  constructor(protected init: T) {}

  execute$(command$: Observable<T>) {
    this.#state.set({ result: this.init, error: null, status: 'working' });
    this.#subscription = command$.subscribe({
      next: (result) =>
        this.#state.set({ result, error: null, status: 'completed' }),
      error: (error) => {
        this.#state.set({ result: this.init, error, status: 'failed' });
        this.#subscription?.unsubscribe();
      },
      complete: () => this.#subscription?.unsubscribe(),
    });
  }
}
