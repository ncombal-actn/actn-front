import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProduitService } from '@core/_services/produit.service';
import { AuthenticationService } from '@core/_services/authentication.service';
import { ConfigurateurService } from '../configurateur.service';
import { environment } from '@env';
import { CartService, StorageService } from '@core/_services';
import { Router } from '@angular/router';
import { LoadingService } from '@core/_services/loading.service';

@Injectable({
    providedIn: 'root'
})
export class ZyxelService extends ConfigurateurService {

	protected _apiLink = environment.configurateurZyxel;

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
        this._apiLink = environment.configurateurZyxel;
        this._marque = 'ZYXE';
        this.load();
    }
}
