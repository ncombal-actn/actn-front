import { ConfigurateurService, Modele } from '@/configurateurs/configurateur.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SvgService } from '@core/_services';
import { environment } from '@env';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import {AsyncPipe} from "@angular/common";
import {HeaderStepperComponent} from "@/configurateurs/sonicwall/header-stepper/header-stepper.component";
import {SlidingListeComponent} from "@/configurateurs/sonicwall/sliding-liste/sliding-liste.component";

@Component({
  selector: 'app-modeles',
  standalone: true,
  templateUrl: './modeles.component.html',
  imports: [
    AsyncPipe,
    HeaderStepperComponent,
    SlidingListeComponent
  ],
  styleUrls: ['./modeles.component.scss']
})
export class ModelesComponent implements OnInit, OnDestroy {

    environment = environment;
    gamme = { titre: '', texte: '' };
	ss = '';
    couleurGamme = 1;
    modeles: Modele[];
    isReady = false;

    private _destroy$ = new Subject<void>();

	constructor(
        private configService: ConfigurateurService,
        private route: ActivatedRoute,
		public svg: SvgService
	) { }

	ngOnInit(): void {
		this.configService.loading$
			.pipe(takeUntil(this._destroy$), filter(isLoading => !isLoading))
			.subscribe(() => {
				this.route.paramMap.pipe(take(1)).subscribe(route => {
					const nomGamme = route.get('gamme');
					this.gamme = { titre: nomGamme, texte: this.configService.textes.get(nomGamme).get(nomGamme) };
					this.ss = this.configService.textes.get(nomGamme).get(nomGamme + '_SS');
					this.modeles = this.configService.modeles.filter(modele => nomGamme.startsWith(modele.crits['Gamme'].value));
					this.isReady = true;
				});
			});
	}

	ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

}
