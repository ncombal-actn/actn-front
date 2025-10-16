import { Component, OnInit } from '@angular/core';
import { ChargementComponent as BaseChargementComponent } from '@/configurateurs/sauvegarde/chargement/chargement.component';
import { SauvegardeService } from '@/configurateurs/sauvegarde/sauvegarde.service';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'conf-chargement',
  templateUrl: '../../../sauvegarde/chargement/chargement.component.html',
  styleUrls: ['./chargement.component.scss', '../../styles/popup.scss', '../../../sauvegarde/chargement/chargement.component.scss'],
  standalone: true
})
export class ChargementComponent extends BaseChargementComponent implements OnInit {

	marque = 'zyxel';

	constructor(
		protected saveService: SauvegardeService,
		protected configService: ConfigurateurService,
		protected router: Router
	) {
		super(saveService, configService, router);
	}

}
