import { Injectable } from '@angular/core';
import { SauvegardeService as BaseSauvegardeService } from '@/configurateurs/sauvegarde/sauvegarde.service';
import { LocalStorageService } from '@core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';

@Injectable({
	providedIn: 'root'
})
export class SauvegardeService extends BaseSauvegardeService {

	constructor(
		protected configurateurService: ConfigurateurService,
		protected localStorage: LocalStorageService,
		protected produitService: ProduitService
	) {
		super(configurateurService, localStorage, produitService);
	}

}
