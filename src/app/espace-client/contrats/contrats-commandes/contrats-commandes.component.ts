import { AfterViewInit, Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdresseService, LicenceCommandesService, SortAndFilterService, WindowService } from '@core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { ContratsComponent } from '../contrats.component';
import {
  faBell,
  faBellSlash,
  faCheckCircle, faHistory,
  faMinusCircle,
  faPenSquare,
  faPlusCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-contrats-commandes',
    templateUrl: './contrats-commandes.component.html',
    styleUrls: ['../contrats.component.scss', './contrats-commandes.component.scss']
})
export class ContratsCommandesComponent extends ContratsComponent implements OnInit, OnDestroy, AfterViewInit {

    @Output() public selectedTabIndexChange = new EventEmitter<number>();

    constructor(
        public licenceService: LicenceCommandesService,
        public produitService: ProduitService,
        protected fb: FormBuilder,
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        public adresseService: AdresseService,
        protected ngZone: NgZone,
        protected window: WindowService,
        protected saf: SortAndFilterService
    ) {
        super(licenceService, produitService, fb, router, activatedRoute, adresseService, ngZone, window, saf);
        this._pageID = 'licence-commande';
    }

  protected readonly faPenSquare = faPenSquare;
  protected readonly faCheckCircle = faCheckCircle;
  protected readonly faTimesCircle = faTimesCircle;
  protected readonly faPlusCircle = faPlusCircle;
  protected readonly faMinusCircle = faMinusCircle;
  protected readonly faHistory = faHistory;
  protected readonly faBellSlash = faBellSlash;
  protected readonly faBell = faBell;
}
