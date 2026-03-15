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
                redirectTo: APP_ROUTES.ABOUT_SYSTEM,
                pathMatch: 'full'
            },
            {
                path: APP_ROUTES.ABOUT_SYSTEM,
                loadComponent: () => import('./core/pages/about-system/about-system').then(m => m.AboutSystem)
            },
            {
                path: APP_ROUTES.ABOUT_US,
                redirectTo: APP_ROUTES.ABOUT_SYSTEM,
                pathMatch: 'full'
            },
            {
                path: APP_ROUTES.FORBIDDEN,
                loadComponent: () => import('./core/pages/forbidden/forbidden').then(m => m.Forbidden)
            },
            {
                path: APP_ROUTES.USERS,
                loadComponent: () => import('./features/users-management/pages/users/users').then(m => m.Users)
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