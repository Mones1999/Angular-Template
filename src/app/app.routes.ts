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
        data: { breadcrumb: 'not_found.title' },
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
                data: { breadcrumb: 'sidebar.menu.about_system' },
                loadComponent: () => import('./core/pages/about-system/about-system').then(m => m.AboutSystem)
            },
            {
                path: APP_ROUTES.USERS,
                data: { breadcrumb: 'users.title' },
                loadComponent: () => import('./features/users/pages/users/users').then(m => m.Users)
            },
            {
                path:APP_ROUTES.SYSTEM_SETTINGS,
                data:{ breadcrumb: 'system_settings.title' },
                loadComponent: () => import('./features/system-settings/pages/system-settings/system-settings').then(m => m.SystemSettings)
            },
            {
                path:APP_ROUTES.CHANGE_PASSWORD,
                data:{ breadcrumb: 'change_password.title' },
                loadComponent: () => import('./features/change-password/pages/change-password/change-password').then(m => m.ChangePassword)
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