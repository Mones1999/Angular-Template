import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { firstValueFrom, tap } from 'rxjs';
import { routes } from './app.routes';
import { AppConfig } from './core/models/AppConfig';
import { ConfigService } from './core/services/config-service';
import { MyPreset } from './../assets/styles/preset';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from '@core/services/language-service';
import { authInterceptor } from '@core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    MessageService,
    LanguageService,
    TranslateService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideTranslateService({
      defaultLanguage: 'en'
    }),
    provideTranslateHttpLoader({
      prefix: '/assets/i18n/',
      suffix: '.json'
    }),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'tw-base, primengicons, primeng, tw-utilities',
          },
          darkModeSelector: '.my-app-dark',
        }
      },

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
    provideAppInitializer(() => {
      const languageService = inject(LanguageService);
      return languageService.initialize();
    }),

  ]
};
