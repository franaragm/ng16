import { ErrorHandler } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ErrorHandlerService } from './app/error-handler.service';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
  ],
}).catch((err) => console.error(err));
