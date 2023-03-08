import { JsonPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { EXCEPTION_SIGNAL } from './exception.store';
@Component({
  selector: 'ng-root',
  standalone: true,
  imports: [NgIf, JsonPipe],
  template: `
    <h1>Angular 16 Signals sandbox</h1>
    <button (click)="onClickData()">📡 Click to send a request!</button>
    <br />
    <button (click)="onClickBadRequest()">
      💣 Click to send an unhandled bad request!
    </button>
    <button (click)="onClickBadRequestHandled()">
      💣 Click to send a handled bad request
    </button>
    <button (click)="onClickError()">
      💣 Click to throw an Application error!
    </button>
    <div *ngIf="data()">
      <p>The data is:</p>
      <pre>{{ data() | json }}</pre>
    </div>
    <div *ngIf="exception() as exception">
      <p>Got an exception:</p>
      <pre>{{ exception | json }}</pre>
    </div>
  `,
})
export class AppComponent {
  #http = inject(HttpClient);
  exception = inject(EXCEPTION_SIGNAL);
  data = signal<object | null>(null);

  constructor() {}

  onClickData() {
    const id = Math.floor(Math.random() * 500);
    this.#http
      .get('https://jsonplaceholder.typicode.com/comments/' + id)
      .subscribe((data) => this.data.set(data));
  }
  onClickBadRequest() {
    this.#http
      .get('https://jsonplaceholder.typicode.com/comments/666')
      .subscribe((data) => this.data.set(data));
  }
  onClickBadRequestHandled() {
    this.#http
      .get('https://jsonplaceholder.typicode.com/comments/666')
      .subscribe({
        next: (data) => this.data.set(data),
        error: (error) =>
          this.exception.set({
            message: error.message,
            category: 'HTTP',
            timestamp: new Date(),
          }),
      });
  }
  onClickError() {
    throw new Error('Test error');
  }
}
