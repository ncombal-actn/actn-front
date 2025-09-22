import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SonicwallRoutingModule } from './sonicwall-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { UtilModule } from '@/_util/util.module';
import { ConfigurateurService } from '../configurateur.service';
import { SonicwallService } from './sonicwall.service';
import { GammesComponent } from './gammes/gammes.component';
import { HeaderStepperComponent } from './header-stepper/header-stepper.component';
import { ModelesComponent } from './modeles/modeles.component';
import { SlidingListeComponent } from './sliding-liste/sliding-liste.component';
import { OptionsComponent } from './options/options.component';
import { BlocPrixComponent } from './bloc-prix/bloc-prix.component';
import { ChipsListComponent } from './chips-list/chips-list.component';
import { HelpComponent } from './help/help.component';
import { RecapitulatifComponent } from './recapitulatif/recapitulatif.component';
import { ExportComponent } from './export/export.component';
import { InputNumberComponent } from './input-number/input-number.component';
import { ResumeComponent } from './options/resume/resume.component';
import { FreeInputComponent } from './free-input/free-input.component';
import { ChargementComponent } from './sauvegarde/chargement/chargement.component';
import { SauvegardeComponent } from './sauvegarde/sauvegarde/sauvegarde.component';
import { SauvegardeService } from '../sauvegarde/sauvegarde.service';
import { SauvegardeService as SoniSauvegardeService } from './sauvegarde/sauvegarde.service';

@NgModule({
	declarations: [
		LandingPageComponent,
		GammesComponent,
		HeaderStepperComponent,
		ModelesComponent,
		SlidingListeComponent,
		OptionsComponent,
		BlocPrixComponent,
		ChipsListComponent,
		HelpComponent,
		ExportComponent,
		ExportComponent,
		InputNumberComponent,
		RecapitulatifComponent,
		ResumeComponent,
		FreeInputComponent,
		ChargementComponent,
		SauvegardeComponent
	],
	imports: [
		CommonModule,
		UtilModule,
		SonicwallRoutingModule
	],
	providers: [{ provide: ConfigurateurService, useClass: SonicwallService }, { provide: SauvegardeService, useClass: SoniSauvegardeService }]
})
export class SonicwallModule { }
