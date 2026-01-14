import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'characters',
        loadComponent: () =>
            import('./pages/characters/characters.component').then(m => m.CharactersComponent)
    },
    {
        path: 'raids',
        loadComponent: () =>
            import('./pages/raids/raids.component').then(m => m.RaidsComponent)
    },
    {
        path: 'activities',
        loadComponent: () =>
            import('./pages/activities/activities.component').then(m => m.ActivitiesComponent)
    }
];
