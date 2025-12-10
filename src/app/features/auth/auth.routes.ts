import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './constants/auth-routes.constants';
export const AuthRoutes: Routes = [
    {
        path: AUTH_ROUTES.LOGIN,
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path:'',
        redirectTo:AUTH_ROUTES.LOGIN
    },
    {
        path:'**',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    }
] 