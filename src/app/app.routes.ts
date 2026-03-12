import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { APP_ROUTES } from './core/constants/app-routes-constants';

export const routes: Routes = [
    {
        path: APP_ROUTES.AUTH,
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AuthRoutes),
    },
    {
        path: APP_ROUTES.NOT_FOUND,
        loadComponent: () => import('./core/pages/not-found/not-found').then(m => m.NotFound)
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./core/layouts/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: '',
                redirectTo: APP_ROUTES.DASHBOARD,
                pathMatch: 'full'
            },
            {
                path: APP_ROUTES.FORBIDDEN,
                loadComponent: () => import('./core/pages/forbidden/forbidden').then(m => m.Forbidden)
            },
            {
                path: '**',
                redirectTo: '/' + APP_ROUTES.NOT_FOUND
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/' + APP_ROUTES.NOT_FOUND
    }
];