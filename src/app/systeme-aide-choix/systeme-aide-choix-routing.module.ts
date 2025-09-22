import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemeAideChoixComponent } from './systeme-aide-choix.component';

const routes: Routes = [
	{
		path: '',
		component: SystemeAideChoixComponent,
		data: {
			filDArianne: [{ url: '', label: 'Espace Licences et Logiciels Cybersécurité', guarded: true }],
		},
		pathMatch: 'full'
	},
	{
		path: ':marque',
		component: SystemeAideChoixComponent,
		data: {
			filDArianne: [{ url: '', label: 'Espace Licences et Logiciels Cybersécurité', guarded: true }],
		}
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SystemeAideChoixRoutingModule { }
