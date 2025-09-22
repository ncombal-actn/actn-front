import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/_core/_guards';

import { PrestationsComponent } from './prestations.component';
import { PrestationsConfirmationComponent } from './prestations-confirmation/prestations-confirmation.component';

const routes: Routes = [
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

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PrestationsRoutingModule { }
