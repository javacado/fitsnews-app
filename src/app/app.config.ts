// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideIonicAngular({ mode: 'ios' }), // <— iOS look & feel
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__fitsnews', // optional: custom DB name
        // optional: drivers order
      })
    ),
  ],
};
