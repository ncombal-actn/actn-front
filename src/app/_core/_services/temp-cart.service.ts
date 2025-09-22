import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { LicenceService } from './licence.service';
import { AuthenticationService } from './authentication.service';
import { Clipboard } from '@angular/cdk/clipboard';
import {LocalStorageService} from "@services/localStorage/local-storage.service";
import {CookieService} from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
})
export class TempCartService extends CartService {

    type: string = "temp"; // variable de vérification du cart / utile seulement au debug

    constructor(
        protected httpClient: HttpClient,
        protected licenceService: LicenceService,
        protected localStorage: LocalStorageService,
        //protected cookieService: CookieService,
        protected authService: AuthenticationService
       // protected clipboard: Clipboard
    ) {
        super(httpClient, licenceService, localStorage, authService);
    }
}
