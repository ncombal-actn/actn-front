import { SnackbarService } from '@/_util/components/snackbar/snackbar.service';
import { Filtre } from '@/_util/models';
import { HttpClient } from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LicenceService } from './licence.service';
import { LocalStorageService } from './localStorage/local-storage.service';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class LicenceCommandesService extends LicenceService {

    constructor(
        protected httpClient: HttpClient,
        protected storageService: StorageService,
        protected router: Router,
        protected injector: Injector,
        protected snackbarService: SnackbarService,
        protected localStorage: LocalStorageService,
       // protected platformId: Object
    ) {
        super(httpClient, storageService, router, injector, snackbarService, localStorage)// platformId);
    }

    /**
     * Retourne les filtres associés aux licences d'un revendeur.
     */
     public getFiltres(): Observable<Array<Filtre>> {
        this._filtres = [];
        return new Observable(obs => {
            this._filtres.push({ target: 'commande.referencecommande', label: 'Votre référence de commande', type: 'string', method: 'includes', forme: 'input', options: [] });
            this._filtres.push({ target: 'commande.numcommande', label: 'N° de commande ACTN', type: 'string', method: 'includes', forme: 'input', options: [] });
            this._filtres.push({ target: 'commande.numfacture', label: 'N° de facture', type: 'string', method: 'includes', forme: 'input', options: [] });
            this._filtres.push({ target: 'produit.marque', label: 'Marque', type: 'array', method: 'includes', forme: 'select', options: [] });
            this._filtres.push({ target: 'produit.reference', label: 'Référence produit', type: 'string', method: 'includes', forme: 'input', options: [] });
            this._filtres.push({ target: 'statut', label: 'Statut', type: 'array', method: 'includes', forme: 'select', options: ['En attente', 'Active', 'Expirée'] });
            obs.next(this._filtres);
            obs.complete();
        });
    }

}
