import { Component, OnInit, OnDestroy, Input } from '@angular/core';
// RXJS
import { Observable, Subscription } from 'rxjs';
import { takeLast, tap } from 'rxjs/operators';
// SERVICES
import { ComparateurService } from '@/_core/_services/comparateur.service';

@Component({
  selector: 'app-comparateur-button',
  templateUrl: './comparateur-button.component.html',
  styleUrls: ['./comparateur-button.component.scss']
})
export class ComparateurButtonComponent implements OnInit, OnDestroy {

	// Attributs
	/////////////////////////////////////////////////////////////////////////////////
	@Input() produitReference: string;
    @Input() displayAsXIcon = false;

	// est ce que 'produitReference' est dans les favoris ?
	inCompare: boolean;
	// liste multi onglet des produits comparés
    referencesOfProductsInCompare: string[] = null;
    // subscription au ComparateurService
    comparateurSubscription: Subscription = null;
	/////////////////////////////////////////////////////////////////////////////////


	constructor(
        public comparateurService: ComparateurService
	) { }

	ngOnInit(): void {
		// set up
        this.referencesOfProductsInCompare = this.comparateurService.setUp();
        if (this.referencesOfProductsInCompare.includes(this.produitReference)) {
            this.inCompare = true;
        }
        else {
            this.inCompare = false;
        }

        // subscribe
        this.comparateurSubscription = this.comparateurService.compare()
        .subscribe(
            (ret) =>
            {
                this.referencesOfProductsInCompare = ret;
                if (ret.includes(this.produitReference)) {
                    this.inCompare = true;
                }
                else {
                    this.inCompare = false;
                }
            }
        );
	}

	ngOnDestroy()
    {
        if (this.comparateurSubscription != null) {
            this.comparateurSubscription.unsubscribe();
        }
    }

	// FAVORIS SERVICE
    /////////////////////////////////////////////////////////////////////////////////

	toggleThisProductInComparateurService(): void
    {
        this.comparateurService.toggleCompare(this.produitReference);
    }

    /////////////////////////////////////////////////////////////////////////////////
}
