import { Injectable, inject, signal, effect, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type LangCode = 'en' | 'ar';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    private translate = inject(TranslateService);
    private primeng = inject(PrimeNG);
    private document = inject(DOCUMENT);
    private platformId = inject(PLATFORM_ID);

    readonly currentLang = signal<LangCode>('en');

    constructor() {
        this.initLanguage();

        effect(() => {
            const lang = this.currentLang();

            this.translate.use(lang);
            this.updateDirection(lang);
            this.updatePrimeNGConfig(lang);

            if (isPlatformBrowser(this.platformId)) {
                sessionStorage.setItem('app-lang', lang);
            }
        });
    }

    toggleLang() {
        this.currentLang.update(lang => lang === 'en' ? 'ar' : 'en');
    }

    private initLanguage() {
        if (isPlatformBrowser(this.platformId)) {
            const savedLang = sessionStorage.getItem('app-lang') as LangCode;
            if (savedLang) {
                this.currentLang.set(savedLang);
            } else {
                const browserLang = this.translate.getBrowserLang();
                this.currentLang.set(browserLang?.match(/en|ar/) ? (browserLang as LangCode) : 'en');
            }
        }
    }

    private updateDirection(lang: LangCode) {
        const html = this.document.documentElement;
        const dir = lang === 'ar' ? 'rtl' : 'ltr';

        html.setAttribute('lang', lang);
        html.setAttribute('dir', dir);

    }
    private updatePrimeNGConfig(lang: LangCode) {
        this.translate.get('PRIMENG').subscribe(res => {
            this.primeng.setTranslation(res);
        });
    }
}