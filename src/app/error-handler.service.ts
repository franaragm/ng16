import { ErrorHandler, inject } from '@angular/core';
import { Exception, EXCEPTION_SIGNAL } from './exception.signal';

export class ErrorHandlerService implements ErrorHandler {
  #exceptionSignal = inject(EXCEPTION_SIGNAL);

  handleError(error: any): void {
    const exception: Exception = {
      message: error.message || 'Unknown error',
      category: 'Unhandled',
      timestamp: new Date().getUTCMilliseconds(),
    };
    console.log(
      '📡 emitting unhandled exception signal:',
      exception.category + ':',
      exception.timestamp
    );
    this.#exceptionSignal.set(exception);
  }
}
