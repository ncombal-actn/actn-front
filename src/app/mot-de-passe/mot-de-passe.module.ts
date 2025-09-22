import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MotDePasseRoutingModule } from './mot-de-passe-routing.module';
import { MdpRecuperationComponent } from './mdp-recuperation/mdp-recuperation.component';
import { MdpOublieComponent } from './mdp-oublie/mdp-oublie.component';
import { UtilModule } from '@/_util/util.module';

@NgModule({
	declarations: [
		MdpOublieComponent,
		MdpRecuperationComponent
	],
	imports: [
		CommonModule,
		UtilModule,
		MotDePasseRoutingModule
	]
})
export class MotDePasseModule { }
