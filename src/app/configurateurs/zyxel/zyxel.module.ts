import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZyxelRoutingModule } from './zyxel-routing.module';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { GammesComponent } from './gammes/gammes.component';
import { ModelesComponent } from './modeles/modeles.component';
import { OptionsComponent } from './options/options.component';
import { RecapitulatifComponent } from './recapitulatif/recapitulatif.component';
import { UtilModule } from '@/_util/util.module';
import { StepperComponent } from './stepper/stepper.component';
import { HeaderStepperComponent } from './header-stepper/header-stepper.component';
import { SlidingListeComponent } from './sliding-liste/sliding-liste.component';
import { BlocPrixComponent } from './bloc-prix/bloc-prix.component';
import { ChipsListComponent } from './chips-list/chips-list.component';
import { HelpComponent } from './help/help.component';
import { ResumeComponent } from './options/resume/resume.component';
import { ConfigurateurService } from '../configurateur.service';
import { ZyxelService } from './zyxel.service';
import { ExportComponent } from './export/export.component';
import { InputNumberComponent } from './input-number/input-number.component';
import { FreeInputComponent } from './free-input/free-input.component';
import { SauvegardeComponent } from './sauvegarde/sauvegarde/sauvegarde.component';
import { ChargementComponent } from './sauvegarde/chargement/chargement.component';
import { SauvegardeService } from '../sauvegarde/sauvegarde.service';
import { SauvegardeService as ZyxelSauvegardeService } from './sauvegarde/sauvegarde.service';

@NgModule({
	declarations: [
		LandingPageComponent,
		GammesComponent,
		ModelesComponent,
		OptionsComponent,
		RecapitulatifComponent,
		StepperComponent,
		HeaderStepperComponent,
		SlidingListeComponent,
		BlocPrixComponent,
		ChipsListComponent,
		HelpComponent,
		ResumeComponent,
		ExportComponent,
		InputNumberComponent,
		FreeInputComponent,
		SauvegardeComponent,
		ChargementComponent,
	],
	imports: [
		UtilModule,
		ZyxelRoutingModule,
		CommonModule
	],
	exports: [],
	providers: [
		{ provide: ConfigurateurService, useClass: ZyxelService },
		{ provide: SauvegardeService, useClass: ZyxelSauvegardeService },
	]
})
export class ZyxelModule { }
