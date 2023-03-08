import { JsonPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { EXCEPTION_SIGNAL } from './exception.signal';
@Component({
  selector: 'ng-root',
  standalone: true,
  imports: [NgIf, JsonPipe],
  template: `
    <h1>Angular 16 Signals sandbox</h1>
    <i>Check millisecond incoherences on async unhandled errors at console</i>
    <br />
    <button (click)="onClickRequest()">👼🏼 Send a good request!</button>
    <br />
    <button (click)="onClickBadRequestHandled()">
      🥳 Send a handled bad request
    </button>
    <br />
    <button (click)="onClickBadRequest()">
      🤯 Send an unhandled bad request
    </button>
    <br />
    <button (click)="onClickError()">
      🤬 Throw an common application error!
    </button>
    <br />
    <button (click)="onClickDelayedError()">
      👹 Throw a Time delayed (async) error!
    </button>
    <br />
    <button (click)="onClickPromiseError()">
      👿 Throw a Promise rejection error!
    </button>
    <br />
    <div *ngIf="data()">
      <p>📦 Got data:</p>
      <pre>{{ data() | json }}</pre>
    </div>
    <div *ngIf="exception() as exception">
      <p>💣 Got an exception:</p>
      <pre>{{ exception | json }}</pre>
    </div>
  `,
})
export class AppComponent {
  #http = inject(HttpClient);
  #cdr = inject(ChangeDetectorRef); // hack to force cd on async errors
  exception = inject(EXCEPTION_SIGNAL);
  data = signal<object | null>(null);

  constructor() {
    effect(() => {
      const data = this.data();
      if (data) console.warn('📡 received data signal:', data);
      else console.log('🕳️ no data signal');
      const exception = this.exception();
      if (exception) {
        console.warn('📡 received exception signal:', exception);
        // 🔬 The cdr resolves the timeout error, but not the promise error
        this.#cdr.detectChanges();
      } else console.log('🕳️ no exception signal');
    });
  }

  onClickRequest() {
    const id = Math.floor(Math.random() * 500);
    this.#http
      .get('https://jsonplaceholder.typicode.com/comments/' + id)
      .subscribe((data) => this.data.set(data));
  }
  onClickBadRequest() {
    // ✅ HTTP errors intercepted are emitted and received as signals
    // ❌ HTTP errors catch by ErrorHandler are not received correctly
    // 🕳️ Deactivate interceptors at main.ts to see it more clearly
    this.#http
      .get('https://jsonplaceholder.typicode.com/comments/666')
      .subscribe((data) => this.data.set(data));
  }
  onClickBadRequestHandled() {
    // ✅ Errors handled are emitted and received as signals
    this.#http
      .get('https://jsonplaceholder.typicode.com/comments/666')
      .subscribe({
        next: (data) => this.data.set(data),
        error: (error) =>
          this.exception.set({
            message: error.message,
            category: 'Handled',
            timestamp: new Date().getUTCMilliseconds(),
          }),
      });
  }
  onClickError() {
    // ✅ Errors catch by ErrorHandler are emitted and received as signals too.
    throw new Error('Test common error');
  }
  onClickDelayedError() {
    // ⚠️ Delayed errors are not received correctly (except whe using the CDR)
    setTimeout(() => {
      throw new Error('Test delayed error');
    }, 1000);
  }
  onClickPromiseError() {
    // ❌ Promises errors are not received correctly
    Promise.reject(new Error('Test promise rejected error'));
  }
}
