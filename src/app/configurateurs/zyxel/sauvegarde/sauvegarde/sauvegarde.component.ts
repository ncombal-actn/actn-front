import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SauvegardeService } from '@/configurateurs/sauvegarde/sauvegarde.service';
import { SauvegardeComponent as BaseSauvegardeComponent } from '@/configurateurs/sauvegarde/sauvegarde/sauvegarde.component';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';

@Component({
	selector: 'conf-sauvegarde',
	templateUrl: '../../../sauvegarde/sauvegarde/sauvegarde.component.html',
	styleUrls: ['./sauvegarde.component.scss', '../../styles/popup.scss']
})
export class SauvegardeComponent extends BaseSauvegardeComponent implements OnInit {

	constructor(
		protected fb: FormBuilder,
		protected saveService: SauvegardeService,
		protected configService: ConfigurateurService
	) {
		super(fb, saveService, configService);
	}

}
