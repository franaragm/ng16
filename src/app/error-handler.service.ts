import { ErrorHandler, inject } from '@angular/core';
import { Exception, EXCEPTION_STORE } from './exception.store';

export class ErrorHandlerService implements ErrorHandler {
  exceptionStore = inject(EXCEPTION_STORE);
  handleError(error: any): void {
    const exception: Exception = {
      message: error.message || 'Unknown error',
      category: 'Application',
      timestamp: new Date(),
    };
    this.exceptionStore.set(exception);
  }
}
