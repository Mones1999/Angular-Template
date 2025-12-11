import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './constants/auth-routes-constants';
import { APP_ROUTES } from '../../core/constants/app-routes-constants';

export const AuthRoutes: Routes = [
    {
        path: AUTH_ROUTES.LOGIN,
        loadComponent: () => import('./pages/login/login').then(m => m.Login),
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: AUTH_ROUTES.LOGIN,
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: `/${APP_ROUTES.NOT_FOUND}`,
        pathMatch: 'full'
    }
]; 