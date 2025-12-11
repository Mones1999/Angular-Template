import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { APP_ROUTES } from '../../constants/app-routes-constants';

@Component({
    selector: 'app-not-found',
    imports: [Card, Button, RouterLink],
    templateUrl: './not-found.html',
    styleUrl: './not-found.scss',
})
export class NotFound {
    homeRoute = `/${APP_ROUTES.ABOUT_US}`;
}
