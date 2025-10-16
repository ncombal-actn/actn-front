import { Routes } from '@angular/router';
import { AuthGuard } from '@core/_guards';
import { ConfigurateursComponent } from './configurateurs.component';

export const CONFIGURATEURS_ROUTES: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'zyxel',
                loadChildren: () =>
                    import('./zyxel/zyxel.routes').then((mod) => mod.ZYXEL_ROUTES),
            },
            /* {
                path: 'sonicwall',
                loadChildren: () =>
                    import('./sonicwall/sonicwall.routes').then((mod) => mod.SONICWALL_ROUTES),
            }, */
            {
                path: ':reference',
                component: ConfigurateursComponent
            }
        ]
    }
];
