import { HttpClient } from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import { CartService } from './cart.service';
import {LocalStorageService} from "@services/localStorage/local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class TempCartService extends CartService {

    type: string = "temp"; // variable de vérification du cart / utile seulement au debug

    constructor(
        protected httpClient: HttpClient,
        protected localStorage: LocalStorageService,
        protected injector: Injector
    ) {
        super(httpClient, localStorage, injector);
    }
}
