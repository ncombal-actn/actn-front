import { Routes } from '@angular/router';
import { SystemeAideChoixComponent } from './systeme-aide-choix.component';

export const SYSTEME_AIDE_CHOIX_ROUTES: Routes = [
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
