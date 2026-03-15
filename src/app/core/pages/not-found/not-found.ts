import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

import { TranslateModule } from '@ngx-translate/core';
import { APP_ROUTES } from '@core/constants/app-routes-constants';

@Component({
    selector: 'app-not-found',
    imports: [Button, RouterLink, TranslateModule],
    templateUrl: './not-found.html',
    styleUrl: './not-found.css',
})
export class NotFound {
    homeRoute = `/${APP_ROUTES.ABOUT_SYSTEM}`;
}
