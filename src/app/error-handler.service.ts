import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject } from '@angular/core';
import { Exception, EXCEPTION_SIGNAL } from './exception.store';

export class ErrorHandlerService implements ErrorHandler {
  #exceptionSignal = inject(EXCEPTION_SIGNAL);

  handleError(error: any): void {
    const exception: Exception = {
      message: error.message || 'Unknown error',
      category: 'Unknown',
      timestamp: new Date(),
    };
    if (error instanceof HttpErrorResponse) {
      exception.category = 'HTTP';
    } else if (error instanceof Error) {
      exception.category = 'Application';
    }
    console.log(
      '📡 exception signal:',
      exception.category + ':',
      exception.timestamp
    );
    this.#exceptionSignal.set(exception);
  }
}
