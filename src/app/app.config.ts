import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { firstValueFrom, tap } from 'rxjs';
import { routes } from './app.routes';
import { AppConfig } from './core/models/AppConfig';
import { ConfigService } from './core/services/config-service';
import { MyPreset } from './../assets/styles/preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
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
          tap(cfg => configService.setConfig(cfg))
        )
      );
    }),
  ]
};
