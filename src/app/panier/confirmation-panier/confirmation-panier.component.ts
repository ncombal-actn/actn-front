import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {CartService} from '@/_core/_services/cart.service';
import {TempCartService} from '@/_core/_services/temp-cart.service';

import {LicenceService} from '@core/_services';
import {HttpClient} from '@angular/common/http';
import {CategorieComponent} from "@/catalogue/categorie/categorie.component";
import {StepperComponent} from "@/panier/stepper/stepper.component";

@Component({
  selector: 'app-confirmation-panier',
  standalone: true,
  imports: [
    CategorieComponent,
    StepperComponent
  ],
  templateUrl: './confirmation-panier.component.html',
  styleUrls: ['./confirmation-panier.component.scss']
})
export class ConfirmationPanierComponent implements OnInit {

  ncmd: any;
  ticket: any;
  transaction = '';
  iban: string
  bic: string
  ncde: any
  carttype: string = "perm";

  cartService: CartService = null;

  constructor(
    private route: ActivatedRoute,
    public permCartService: CartService,
    public tempCartService: TempCartService,
    public licenceService: LicenceService,
    public http: HttpClient
  ) {
  }

  ngOnInit() {
    // Retrieve query parameters
    this.route.queryParams.pipe(take(1)).subscribe((params) => {

      this.carttype = params['carttype'];
      this.ncde = decodeURIComponent(params['ncde']);
      this.ncmd = decodeURIComponent(params['ncmd']);

      /*   if (this.ncde == undefined) {
          this.ncde = this.route.snapshot.queryParams['ncde']
        }
        if (this.ncmd == undefined) {
        } */
      this.ticket = decodeURIComponent(params['ticket']);
      this.transaction = decodeURIComponent(params['transaction']);

      if (this.carttype === 'temp') {
        this.cartService = this.tempCartService;
      } else {
        this.cartService = this.permCartService;
      }

      this.cartService.emptyCart();

      // this.ticket = decodeURIComponent(params['ticket']);
      // this.transaction = decodeURIComponent(params['transaction']);

      if (this.ncmd != null) {
        this.licenceService.majEnduser().subscribe();
      }

      this.permCartService.getIban().subscribe((perm) => {
        this.iban = perm;
      });

      this.permCartService.getBic().subscribe((perm) => {
        this.bic = perm;
      });
    });
  }

  ngOnDestroy() {
    this.cartService.eraseValidCommande();
  }

}
