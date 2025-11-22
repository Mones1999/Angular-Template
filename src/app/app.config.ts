import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { ConfigService } from './core/services/config-service';
import { catchError, firstValueFrom, map, of, tap } from 'rxjs';
import { AppConfig } from './core/models/AppConfig';
import { starterPreset } from './shared/themes/starter.preset';

const DEFAULT_APP_CONFIG: AppConfig = {
  appName: 'Angular Starter',
  apiUrl: 'http://localhost:9009/SDK_API/api',
  defaultTheme: 'light',
  featureFlags: {}
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: starterPreset,
        options: {
          cssLayer: true,
          darkModeSelector: '.my-app-dark',
        }
      }
    }),
    provideAppInitializer(() => {
      const http = inject(HttpClient);
      const configService = inject(ConfigService);
      return firstValueFrom(
        http.get<AppConfig>('assets/config.json').pipe(
          map(cfg => ({ ...DEFAULT_APP_CONFIG, ...cfg })),
          tap(cfg => configService.setConfig(cfg)),
          catchError(error => {
            console.error('Failed to load runtime configuration. Falling back to defaults.', error);
            configService.setConfig(DEFAULT_APP_CONFIG);
            return of(DEFAULT_APP_CONFIG);
          })
        )
      );
    }),
  ]
};
