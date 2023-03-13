import {
  computed,
  Injectable,
  SettableSignal,
  Signal,
  signal,
} from '@angular/core';

export type Auth = {
  id: string;
  email: string;
  token: string;
};

/**
 * Auth Signal Store
 * @description A simple store for auth state
 */
@Injectable({ providedIn: 'root' })
export class AuthSignalStore {
  // private signal state
  #initialData: Auth = { id: '', email: '', token: '' };
  #user: SettableSignal<Auth> = signal<Auth>(this.#initialData);
  // public readonly data signal
  auth: Signal<Auth> = computed(() => this.#user());
  // logical computed signals
  isAnonymous: Signal<boolean> = computed(() => this.#user().id === '');
  needsRevalidation: Signal<boolean> = computed(() => {
    const user = this.#user();
    return user.id !== '' && user.token === '';
  });
  // public mutation methods
  login(auth: Auth) {
    this.#user.set(auth);
  }
  logout() {
    this.#user.set(this.#initialData);
  }
  // Partial mutation
  expired() {
    this.#user.mutate((user) => (user.token = ''));
  }
}
