import { Routes } from '@angular/router';

export const AuthRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path:'',
        pathMatch:'full',
        redirectTo:'login'
    },
    {
        path:'**',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    }
] 