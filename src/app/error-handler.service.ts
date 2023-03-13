import { ErrorHandler, inject } from '@angular/core';
import { Exception, EXCEPTION_SIGNAL } from './exception.signal';

/**
 * Global error handler
 */
export class ErrorHandlerService implements ErrorHandler {
  // get the exception signal token inject
  #exceptionSignal = inject(EXCEPTION_SIGNAL);

  handleError(error: any): void {
    // adapt the error to the exception signal
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
    // emit the exception signal (like next in a stream)
    this.#exceptionSignal.set(exception);
  }
}
