import { JsonPipe, NgIf } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { EXCEPTION_STORE } from './exception.store';

@Component({
  selector: 'ng-root',
  standalone: true,
  imports: [NgIf, JsonPipe],
  template: `
    <button (click)="onClick()">Click me!</button>
    <div *ngIf="showException()">
      {{ exception() | json }}
    </div>
  `,
})
export class AppComponent {
  exception = inject(EXCEPTION_STORE);
  showException = signal(false);

  constructor() {
    effect(() => {
      if (this.exception() === null) return;
      this.showException.set(true);
      setTimeout(() => {
        this.showException.set(false);
      }, 5000);
    });
  }

  onClick() {
    throw new Error('Test error');
  }
}
