import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Cotation } from "@/_util/models/cotation";
import { Produit } from "@/_util/models";
import { Subject } from "rxjs";
import { CartService, CotationService } from "@core/_services";
import { takeUntil } from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: "app-cotation-row",
  templateUrl: "./cotation-row.component.html",
  styleUrls: ["./cotation-row.component.scss"],
})
export class CotationRowComponent implements OnDestroy, OnChanges {

  @Input() produit: Produit = null;

  @Input() uneditable = false; // Si true, n'affiche que la cotation active et ne permet pas d'en changer

  @Input() warningOnQte = false; // Si true, on coutoure la quantité 

  cotations: Cotation[] = [];
  hasPrixCotation = false;
  indexOfCot = -1;
 

  @Output() activeCotation = new EventEmitter<Cotation>();

  private _destroy$ = new Subject<void>();

  defCot: number;

  constructor(
    private cotationService: CotationService,
    private cartService: CartService,
	private router: Router,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.produit && changes.produit.currentValue) {
      this.loadCotations();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  loadCotations(): void {
    this.cotationService
      .getProduitCotations(this.produit.reference)
      .pipe(takeUntil(this._destroy$))
      .subscribe((ret) => {
        if (ret.length >= 1) {
          this.cotations = ret;
          this.setInitialCotation();
          const index = this.cotations.findIndex(
            (cotation) => cotation.perm === "O"
          );
          if (index !== -1) {
            this.defCot = index;
          }
          this.hasPrixCotation = this.cotations.some(
            (cotation) => cotation.prixstd < cotation.prixvente
          );

          // Si on est sur la page de validation du panier, on ne change pas la cotation par défaut
			if (!this.router.url.includes('/panier/commander/valider')) {
				this.cotations.forEach((i) => {
				  this.changeRadioCot(i);
				});
			  
				this.cotations.forEach((cotation, i) => {
				  if (cotation.prixstd > cotation.prixvente) {
					this.changeRadioCot(i);
				  }
				});
			  }
        }
      });
  }

  /**
   * Initialise 'indexOfCot' sur l'index de 'cotations' correspondant à la cotation active du produit s'il y en a une
   */
  setInitialCotation(): void {
    if (this.cartService.cart.items[this.produit.reference]?.cotation != null) {
      let i = 0;
      const end = this.cotations.length;
      while (i < end) {
        if (
          this.cotations[i].produit ==
          this.cartService.cart.items[this.produit.reference].cotation.produit
        ) {
          this.indexOfCot = i;
          this.activeCotation.next(this.cotations[i]);
        }
        i++;
      }
    }
  }

  changeRadioCot(index): void {
    // si on clique 2 fois sur le même checkbox, on reset 'indexOfCot' à -1
    if (this.indexOfCot == index) {
      this.indexOfCot = -1;
    } else {
      this.indexOfCot = index;
    }

    if (this.indexOfCot >= 0) {
      this.cartService.changeCotation(
        this.cotations[this.indexOfCot],
        this.produit.reference
      );
      this.activeCotation.next(this.cotations[index]);
    } else {
      this.cartService.removeCotation(this.produit.reference);
      this.activeCotation.next(null);
    }
  }
}
