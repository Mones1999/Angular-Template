import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-about-system',
    imports: [TranslateModule, Card, Button],
    templateUrl: './about-system.html',
    styleUrl: './about-system.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutSystem {
    readonly capabilities = [
        {
            icon: 'pi pi-shield',
            titleKey: 'ABOUT_SYSTEM.CAPABILITIES.SECURITY.TITLE',
            descriptionKey: 'ABOUT_SYSTEM.CAPABILITIES.SECURITY.DESCRIPTION',
        },
        {
            icon: 'pi pi-bolt',
            titleKey: 'ABOUT_SYSTEM.CAPABILITIES.PERFORMANCE.TITLE',
            descriptionKey: 'ABOUT_SYSTEM.CAPABILITIES.PERFORMANCE.DESCRIPTION',
        },
        {
            icon: 'pi pi-sync',
            titleKey: 'ABOUT_SYSTEM.CAPABILITIES.INTEGRATION.TITLE',
            descriptionKey: 'ABOUT_SYSTEM.CAPABILITIES.INTEGRATION.DESCRIPTION',
        },
    ];

    readonly systemFacts = [
        {
            icon: 'pi pi-server',
            labelKey: 'ABOUT_SYSTEM.FACTS.RELEASE',
            valueKey: 'ABOUT_SYSTEM.DUMMY.RELEASE',
        },
        {
            icon: 'pi pi-code',
            labelKey: 'ABOUT_SYSTEM.FACTS.FRAMEWORK',
            valueKey: 'ABOUT_SYSTEM.DUMMY.FRAMEWORK',
        },
        {
            icon: 'pi pi-cloud',
            labelKey: 'ABOUT_SYSTEM.FACTS.ENVIRONMENT',
            valueKey: 'ABOUT_SYSTEM.DUMMY.ENVIRONMENT',
        },
        {
            icon: 'pi pi-users',
            labelKey: 'ABOUT_SYSTEM.FACTS.SUPPORTED_USERS',
            valueKey: 'ABOUT_SYSTEM.DUMMY.SUPPORTED_USERS',
        },
    ];
}
