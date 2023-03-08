import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { apiInterceptor } from './app/api.interceptor';
import { AppComponent } from './app/app.component';
import { ErrorHandlerService } from './app/error-handler.service';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
    provideHttpClient(withInterceptors([apiInterceptor])),
  ],
}).catch((err) => console.error(err));
