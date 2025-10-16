import { Routes } from '@angular/router';

import { AuthGuard } from '@/_core/_guards';

import { PrestationsComponent } from './prestations.component';
import { PrestationsConfirmationComponent } from './prestations-confirmation/prestations-confirmation.component';

export const PRESTATIONS_ROUTES: Routes = [
	{
		path: '',
		component: PrestationsComponent,
		data: {},
		canActivate: [AuthGuard],
	},
	{
		path: 'confirmation',
		component: PrestationsConfirmationComponent,
		data: {},
		canActivate: [AuthGuard],
	}
];
