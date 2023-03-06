import {
  computed,
  Injectable,
  SettableSignal,
  Signal,
  signal,
} from '@angular/core';

export type User = {
  id: string;
  name: string;
  token: string;
};

@Injectable({ providedIn: 'root' })
export class UserStore {
  // private signal state
  #initialUser: User = { id: '', name: '', token: '' };
  #user: SettableSignal<User> = signal<User>(this.#initialUser);
  // public readonly data signals
  id: Signal<string> = computed(() => this.#user().id);
  name: Signal<string> = computed(() => this.#user().name);
  token: Signal<string> = computed(() => this.#user().token);
  // logical signals
  isAnonymous: Signal<boolean> = computed(() => this.#user().id === '');
  needsRevalidate: Signal<boolean> = computed(() => {
    const user = this.#user();
    return user.id !== '' && user.token === '';
  });
  // public mutation methods
  login(user: User) {
    this.#user.set(user);
  }
  logout() {
    this.#user.set(this.#initialUser);
  }
  expired() {
    this.#user.mutate((user) => (user.token = ''));
  }
}
