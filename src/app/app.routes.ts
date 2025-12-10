import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { APP_ROUTES } from './core/constants/app-routes-constants';
export const routes: Routes = [
    {
        path: APP_ROUTES.AUTH,
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AuthRoutes),
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: APP_ROUTES.ABOUT_US,
                loadComponent: () => import('./features/about-us/pages/about-us/about-us').then(m => m.AboutUs)
            },
            {
                path:'',
                redirectTo:APP_ROUTES.ABOUT_US
            }

        ]
    },
    {
        path:'',
        redirectTo:APP_ROUTES.AUTH
    },
    {
        path:'**',
        redirectTo:APP_ROUTES.NOT_FOUND
    }
    
];
