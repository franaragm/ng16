import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, throwError } from 'rxjs';
import { Exception, EXCEPTION_SIGNAL } from './exception.signal';

/**
 * Intercepts API calls and emits an exception signal
 * @param req The current request
 * @param next The next function in the chain
 * @returns An observable of the processed request
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // get the exception signal token inject
  const exceptionSignal = inject(EXCEPTION_SIGNAL);
  return next(req).pipe(
    catchError((error) => {
      // adapt the error to the exception signal
      const exception: Exception = {
        message: error.message || 'Unknown error',
        category: 'Intercepted',
        timestamp: new Date().getUTCMilliseconds(),
      };
      console.log(
        '📡 emitting intercepted exception signal:',
        exception.category + ':',
        exception.timestamp
      );
      // emit the exception signal (like next in a stream)
      exceptionSignal.set(exception);
      // rethrow the error so the caller or other interceptors can handle it
      return throwError(() => error);
    })
  );
};
