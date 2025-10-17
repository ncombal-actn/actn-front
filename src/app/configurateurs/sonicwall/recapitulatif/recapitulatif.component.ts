import { Component, OnInit } from '@angular/core';
import { RecapitulatifComponent as ZyxeRecapitulatifComponent } from '@/configurateurs/zyxel/recapitulatif/recapitulatif.component';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SvgService } from '@core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { takeUntil, filter, take } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-recapitulatif',
  standalone: true,
  templateUrl: '../../zyxel/recapitulatif/recapitulatif.component.html',
  styleUrls: ['./recapitulatif.component.scss', '../options/options.component.scss'],
  animations: [
    trigger('expandVertical', [
      state(
        'open',
        style({
          height: '*'
        })
      ),
      state(
        'closed',
        style({
          height: '0'
        })
      ),
      transition('open => closed', animate('300ms ease-in-out')),
      transition('closed => open', animate('300ms ease-in-out'))
    ])
  ]
})
export class RecapitulatifComponent extends ZyxeRecapitulatifComponent implements OnInit {

	constructor(
		protected configService: ConfigurateurService,
		protected router: Router,
		protected route: ActivatedRoute,
		protected produitService: ProduitService,
		public svg: SvgService
	) {
		super(configService, router, route, produitService, svg);
	}

	ngOnInit(): void {
		this.configService.loading$
			.pipe(takeUntil(this._destroy$), filter(isLoading => !isLoading))
			.subscribe(() => {
				if (!this.configService.configuration) {
					this.router.navigate(['..', 'options'], { relativeTo: this.route });
				} else {
					this.route.paramMap.pipe(take(1)).subscribe(route => {
						const nomGamme = route.get('gamme');
						const ref = route.get('modele');
						this.gamme = { titre: nomGamme, texte: this.configService.textes.get(nomGamme).get(nomGamme) };
						this.modele = this.configService.modeles.filter(modele => nomGamme.startsWith(modele.crits['Gamme'].value)).find(modele => modele.produit === ref);
						this.isReady = true;
					});
				}
			});
	}

	ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

}
