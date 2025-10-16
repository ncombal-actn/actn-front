import {CartItem} from '@/_util/models';
import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {
  AuthenticationService, CartService,
  ComponentsInteractionService,
  Devis,
  LicenceService,
  UserService,
  WindowService
} from '@core/_services';
import {ProduitService} from '@core/_services/produit.service';
import {RmaService} from '@core/_services/rma.service';
import {TransportService} from '@core/_services/transport.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-validation-devis',
  standalone: true,
  templateUrl: './validation-devis.component.html',
  styleUrls: ['./validation-devis.component.scss']
})
export class ValidationDevisComponent {

  public devis: Devis = null;
  public produits = new Array<CartItem>();
  tuerMoi: number
  private _ready$ = new BehaviorSubject<number>(0);

  constructor(
    public authService: AuthenticationService,
    public userService: UserService,
    public componentsInteractionService: ComponentsInteractionService,
    protected fb: FormBuilder,
    protected sr: DomSanitizer,
    protected http: HttpClient,
    protected rmaService: RmaService,
    protected licenceService: LicenceService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected produitService: ProduitService,
    protected windows: WindowService,
    protected cartService: CartService,
  ) {
  }
}
