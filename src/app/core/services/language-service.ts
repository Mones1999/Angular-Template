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

    public initialize(): Promise<void> {
        if (isPlatformBrowser(this.platformId)) {
            const savedLang = sessionStorage.getItem('app-lang') as LangCode;
            let lang: LangCode = 'en';

            if (savedLang) {
                lang = savedLang;
            } else {
                const browserLang = this.translate.getBrowserLang();
                lang = browserLang?.match(/en|ar/) ? (browserLang as LangCode) : 'en';
            }

            this.currentLang.set(lang);
            return new Promise<void>(resolve => {
                this.translate.use(lang).subscribe(() => resolve());
            });
        }
        return Promise.resolve();
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