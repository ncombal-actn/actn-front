import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, CartService, StorageService } from '@core/_services';
import { LoadingService } from '@core/_services/loading.service';
import { ProduitService } from '@core/_services/produit.service';
import { environment } from '@env';
import { ConfigurateurService } from '../configurateur.service';

@Injectable({
	providedIn: 'root'
})
export class SonicwallService extends ConfigurateurService {

	protected _apiLink = environment.configurateurSonicWall;

    constructor(
        protected http: HttpClient,
        protected produitService: ProduitService,
        protected authService: AuthenticationService,
		protected cartService: CartService,
		protected router: Router,
		protected storageService: StorageService,
		protected loadingService: LoadingService
    ) {
        super(http, produitService, authService, cartService, router, storageService, loadingService);
		this._apiLink = environment.configurateurSonicWall;
		this._marque = 'SONI';
		this.load();
	}
}
