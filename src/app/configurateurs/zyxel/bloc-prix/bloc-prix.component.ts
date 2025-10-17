import {ConfigurateurService} from '@/configurateurs/configurateur.service';
import {User} from '@/_util/models';
import {Location, LocationProduit} from '@/_util/models/produit';
import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService, ComponentsInteractionService} from '@core/_services';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CurrencyPipe, NgClass} from "@angular/common";
import {ChipsListComponent} from "@/configurateurs/zyxel/chips-list/chips-list.component";

@Component({
  selector: 'conf-bloc-prix',
  standalone: true,
  imports: [
    CurrencyPipe,
    ChipsListComponent,
    NgClass
  ],
  templateUrl: './bloc-prix.component.html',
  styleUrls: ['./bloc-prix.component.scss']
})
export class BlocPrixComponent implements OnInit, OnDestroy {

  public user: User = null;
  public showHelpPopup = false;
  public onOptions = false;
  public produitPourLocation: any = {};
  public produitsLocation: LocationProduit[] = null;
  public locationSelectionne = new Location();

  @Output() public start = new EventEmitter<void>();

  protected _destroy$ = new Subject<void>();

  constructor(
    public configService: ConfigurateurService,
    public componentsInteractionService: ComponentsInteractionService,
    protected authService: AuthenticationService,
    protected route: ActivatedRoute
  ) {
    this.onOptions = this.route.snapshot.url.some(p => p.path === 'options');
  }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this._destroy$)).subscribe(user => this.user = user);

    this.genererProduitPourLocation();
    this.configService.configurationChange.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.genererProduitPourLocation();
    });
  }

  genererProduitPourLocation(): void {
    this.produitPourLocation = {
      prix: this.configService.configuration.prix,
      prixPublic: this.configService.configuration.prixPublic,
      garantie: '60'
    }
    this.produitsLocation = this.configService.configuration.getProductListWithQuantities()
      .map(produit => {
        return {produit: this.configService.produits.find(p => p.reference === produit.produit), qte: produit.qte}
      })
      .reduce((acc: LocationProduit[], produit) => acc = [...acc, new LocationProduit(produit.produit, produit.qte)], [])
      .filter(produit => produit.qte > 0);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onClickConfigurez(): void {
    this.start.emit();
  }

}
