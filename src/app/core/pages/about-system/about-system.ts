import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { AboutSystemService } from '@core/services/about-system-service';
import { AboutSystem as AboutSystemModel } from '@core/models/AboutSystem';
import { LanguageService } from '@core/services/language-service';
import { TranslateModule } from '@ngx-translate/core';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-about-system',
    imports: [TranslateModule, Card],
    templateUrl: './about-system.html',
    styleUrl: './about-system.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutSystem {
    private aboutSystemService = inject(AboutSystemService);
    private languageService = inject(LanguageService);

    aboutSystemFields = signal<AboutSystemModel[]>([]);

    productName = computed(() => this.getFieldValue('Product Name'));
    description = computed(() => this.getFieldValue('Description'));
    detailFields = computed(() =>
        this.aboutSystemFields().filter(f => f.key !== 'Product Name' && f.key !== 'Description')
    );

    ngOnInit() {
        this.loadAboutSystemFields();
    }

    getFieldKey(field: AboutSystemModel): string {
        return this.languageService.currentLang() === 'ar' ? field.keyArabic : field.key;
    }

    getFieldValue(keyOrField: string | AboutSystemModel): string {
        if (typeof keyOrField === 'string') {
            const field = this.aboutSystemFields().find(f => f.key === keyOrField);
            if (!field) return '';
            return this.languageService.currentLang() === 'ar' ? field.valueArabic : field.value;
        }
        return this.languageService.currentLang() === 'ar' ? keyOrField.valueArabic : keyOrField.value;
    }

    private loadAboutSystemFields() {
        this.aboutSystemService.getAboutSystemFields().subscribe({
            next: (res) => {
                this.aboutSystemFields.set(res.result!);
            },
            error: (e) => {
                console.error('Failed to load about system fields', e.error);
            }
        });
    }
}
