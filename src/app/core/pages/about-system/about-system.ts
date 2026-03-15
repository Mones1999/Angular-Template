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
            titleKey: 'about_system.capabilities.security.title',
            descriptionKey: 'about_system.capabilities.security.description',
        },
        {
            icon: 'pi pi-bolt',
            titleKey: 'about_system.capabilities.performance.title',
            descriptionKey: 'about_system.capabilities.performance.description',
        },
        {
            icon: 'pi pi-sync',
            titleKey: 'about_system.capabilities.integration.title',
            descriptionKey: 'about_system.capabilities.integration.description',
        },
    ];

    readonly systemFacts = [
        {
            icon: 'pi pi-server',
            labelKey: 'about_system.facts.release',
            valueKey: 'about_system.dummy.release',
        },
        {
            icon: 'pi pi-code',
            labelKey: 'about_system.facts.framework',
            valueKey: 'about_system.dummy.framework',
        },
        {
            icon: 'pi pi-cloud',
            labelKey: 'about_system.facts.environment',
            valueKey: 'about_system.dummy.environment',
        },
        {
            icon: 'pi pi-users',
            labelKey: 'about_system.facts.supported_users',
            valueKey: 'about_system.dummy.supported_users',
        },
    ];
}
