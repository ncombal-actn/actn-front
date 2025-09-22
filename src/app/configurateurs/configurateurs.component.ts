import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '@core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { environment } from '@env';
import { Subject } from 'rxjs';
import { bufferCount, map, take } from 'rxjs/operators';
import { AssociativeArray } from './configurateur.service';

/** Composant utilisé pour rediriger l'utilisateur vers la page des options d'un firewall à partir d'une référence produit */
@Component({
	selector: 'app-configurateurs',
	templateUrl: './configurateurs.component.html',
	styleUrls: ['./configurateurs.component.scss']
})
export class ConfigurateursComponent implements OnInit {

	public isProductFound = true;
	public ref = '';

	constructor(
		public produitService: ProduitService,
		protected http: HttpClient,
		protected storageService: StorageService,
		protected route: ActivatedRoute,
		protected router: Router
	) { }

	ngOnInit(): void {
		this.storageService.getStoredData('configurateurs', 'headers', () => {
			return this.http.get<AssociativeArray[]>(
				environment.apiUrl + 'FiltresConfigurateur.php',
				{ withCredentials: true }
			)
		})
			.pipe(
				take(1),
				map(headers => headers = headers.filter(header => header.NIV2 === 'FIR')))
			.subscribe(headers => {
				const count = headers.length;
				const end$ = new Subject<boolean>();
				headers.forEach(header => {
					this.storageService.getStoredData('configurateurs', header.marque + header.NIV1 + header.NIV2, () => {
						return this.http.get<AssociativeArray[]>(
							environment.apiUrl + 'FiltresConfigurateurDetail.php',
							{
								withCredentials: true,
								params: {
									marque: header.marque,
									niv1: header.NIV1,
									niv2: header.NIV2
								}
							}
						)
					}).pipe(take(1)).subscribe(options => {
						this.route.paramMap.pipe(take(1)).subscribe(params => {
							this.ref = params.get('reference');
							const option = options.find(option => option.produit === this.ref);
							if (option) {
								let marque = '';
								switch (option.marque) {
									case 'ZYXE':
										marque = 'zyxel';
										break;
									case 'SONI':
										marque = 'sonicwall';
										break;
								}
								end$.next(true);
								this.router.navigateByUrl(`/configurateur/${marque}/gammes/${option.val01}/modeles/${option.val02}/options`, { replaceUrl: true });
							} else {
								end$.next(false);
							}
						});
					});
				});
				end$.pipe(take(count), bufferCount(count)).subscribe((states: boolean[]) => {
					this.isProductFound = states.some(state => state);
				});
			});
	}

}
