import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { TranslateModule } from '@ngx-translate/core';
import { APP_ROUTES } from '../../constants/app-routes-constants';

@Component({
    selector: 'app-forbidden',
    imports: [Card, Button, RouterLink, TranslateModule],
    templateUrl: './forbidden.html',
    styleUrl: './forbidden.scss',
})
export class Forbidden {
    homeRoute = `/${APP_ROUTES.ABOUT_US}`;
}
