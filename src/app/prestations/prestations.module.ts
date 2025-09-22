import { NgModule } from '@angular/core';

import { PrestationsRoutingModule } from './prestations-routing.module';
import { PrestationsConfirmationComponent } from './prestations-confirmation/prestations-confirmation.component';
import { UtilModule } from '@/_util/util.module';
import { PrestationsComponent } from './prestations.component';


@NgModule({
	declarations: [
		PrestationsConfirmationComponent,
		PrestationsComponent
		
	],
	imports: [
		UtilModule,
		PrestationsRoutingModule,
		
	]
})
export class PrestationsModule { }
