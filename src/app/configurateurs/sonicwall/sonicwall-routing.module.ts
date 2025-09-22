import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GammesComponent } from './gammes/gammes.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ModelesComponent } from './modeles/modeles.component';
import { OptionsComponent } from './options/options.component';
import { RecapitulatifComponent } from './recapitulatif/recapitulatif.component';

const routes: Routes = [
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

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SonicwallRoutingModule { }
