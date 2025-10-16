import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LicenceService, TempCartService } from '@core/_services';
import { take } from 'rxjs/operators';
import {CategorieComponent} from "@/catalogue/categorie/categorie.component";

@Component({
	selector: 'app-devis-confirmation',
  standalone: true,
  imports: [
    CategorieComponent
  ],
	templateUrl: './devis-confirmation.component.html',
	styleUrls: ['./devis-confirmation.component.scss']
})
export class DevisConfirmationComponent implements OnInit, OnDestroy {

	ncmd = 0;
	ticket = 0;
	transaction = '';
	valideCommande;

	constructor(
		private route: ActivatedRoute,
		public cartService: TempCartService,
		public licenceService: LicenceService
	) {
		this.cartService.emptyCart();
		this.valideCommande = this.cartService.getValidCommande();

		if (this.valideCommande?.transaction == null) {
			this.route.queryParams.pipe(take(1)).subscribe((params) => {

				this.ncmd = params['ncde'];
				this.ticket = params['ticket'];
				this.transaction = params['transaction'];
			});
		} else {
			this.ncmd = this.valideCommande.ncmd;
			this.ticket = this.valideCommande.ticket;
			this.transaction = this.valideCommande.transaction;
		}

		if (this.ncmd != null) {
			this.licenceService.majEnduser().subscribe();
		}




	}

	ngOnInit(): void { }

	ngOnDestroy(): void {
		this.cartService.eraseValidCommande();
	}
}
