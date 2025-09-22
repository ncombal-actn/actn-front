import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurateursRoutingModule } from './configurateurs-routing.module';
import { UtilModule } from '@/_util/util.module';
import { ConfigurateursComponent } from './configurateurs.component';

@NgModule({
	declarations: [
		ConfigurateursComponent
	],
	imports: [
		ConfigurateursRoutingModule,
		CommonModule,
		UtilModule
	],
	exports: []
})
export class ConfigurateursModule { }
