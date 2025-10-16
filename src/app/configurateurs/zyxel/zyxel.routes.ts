import { Routes } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { GammesComponent } from './gammes/gammes.component';
import { ModelesComponent } from './modeles/modeles.component';
import { OptionsComponent } from './options/options.component';
import { RecapitulatifComponent } from './recapitulatif/recapitulatif.component';

export const ZYXEL_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: LandingPageComponent,
        data: {},
    },
    {
        path: 'gammes',
        pathMatch: 'full',
        component: GammesComponent,
        data: {},
    },
    {
        path: 'gammes/:gamme/modeles',
        pathMatch: 'full',
        component: ModelesComponent,
        data: {},
    },
    {
        path: 'gammes/:gamme/modeles/:modele/options',
        pathMatch: 'full',
        component: OptionsComponent,
        data: {},
    },
    {
        path: 'gammes/:gamme/modeles/:modele/recapitulatif',
        pathMatch: 'full',
        component: RecapitulatifComponent,
        data: {},
    },
];
