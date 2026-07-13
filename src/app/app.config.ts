import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { mockApiInterceptor } from './core/mocks/mock-api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // DEV-ONLY: mockApiInterceptor resolves every /api/... call against sample
    // in-memory data, so the app works without a real backend. Remove it once
    // a real API is connected.
    provideHttpClient(withInterceptors([mockApiInterceptor])),
    provideAnimations(),
  ],
};
