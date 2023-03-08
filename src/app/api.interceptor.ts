import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, throwError } from 'rxjs';
import { Exception, EXCEPTION_SIGNAL } from './exception.signal';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const exceptionSignal = inject(EXCEPTION_SIGNAL);
  return next(req).pipe(
    catchError((error) => {
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
      exceptionSignal.set(exception);
      return throwError(() => error);
    })
  );
};
