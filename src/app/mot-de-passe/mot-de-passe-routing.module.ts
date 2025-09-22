import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MdpOublieComponent } from './mdp-oublie/mdp-oublie.component';
import { MdpRecuperationComponent } from './mdp-recuperation/mdp-recuperation.component';

const routes: Routes = [
	{
		path: 'oublie',
		component: MdpOublieComponent,
		data: {
			filDArianne: [{ url: 'oublie', label: 'Mot de passe oublié', guarded: true }],
		}
	},
	{
		path: 'recuperation',
		component: MdpRecuperationComponent,
		data: {
			filDArianne: [{ url: 'recuperation', label: 'Récupération de mot de passe', guarded: true }],
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MotDePasseRoutingModule { }
