import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AuthRoutes),
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: 'about-us',
                loadComponent: () => import('./features/about-us/pages/about-us/about-us').then(m => m.AboutUs)
            },
            {
                path:'',
                pathMatch:'full',
                redirectTo:'about-us'
            }

        ]
    },
    {
        path:'',
        pathMatch:'full',
        redirectTo:'auth'
    },
    
];
