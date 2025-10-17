import { Produit } from '@/_util/models';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SvgService } from '@core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { environment } from '@env';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { ConfigurateurService, Modele, Option } from '../../configurateur.service';
import { ExportComponent } from '../export/export.component';
import {faFilePdf, faPlayCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import {HelpComponent} from "@/configurateurs/zyxel/help/help.component";
import {ChargementComponent} from "@/configurateurs/sauvegarde/chargement/chargement.component";
import {SauvegardeComponent} from "@/configurateurs/sauvegarde/sauvegarde/sauvegarde.component";
import {HeaderStepperComponent} from "@/configurateurs/zyxel/header-stepper/header-stepper.component";
import {AsyncPipe, CurrencyPipe, KeyValuePipe, NgClass, NgStyle} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {BanniereComponent} from "@/banniere/banniere.component";
import {BlocPrixComponent} from "@/configurateurs/zyxel/bloc-prix/bloc-prix.component";
import {ChipsListComponent} from "@/configurateurs/zyxel/chips-list/chips-list.component";
import {FreeInputComponent} from "@/configurateurs/zyxel/free-input/free-input.component";
import {InputNumberComponent} from "@/configurateurs/zyxel/input-number/input-number.component";

@Component({
	selector: 'app-recapitulatif',
  standalone: true,
  imports: [
    ChargementComponent,
    HeaderStepperComponent,
    HelpComponent,
    SauvegardeComponent,
    AsyncPipe,
    FaIconComponent,
    KeyValuePipe,
    CurrencyPipe,
    NgClass,
    MatRadioGroup,
    MatRadioButton,
    NgStyle,
    BanniereComponent,
    BlocPrixComponent,
    ChipsListComponent,
    FreeInputComponent,
    InputNumberComponent,
    ExportComponent
  ],
	templateUrl: './recapitulatif.component.html',
	styleUrls: ['./recapitulatif.component.scss', '../options/options.component.scss', '../modeles/modeles.component.scss'],
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
export class RecapitulatifComponent implements OnInit, OnDestroy {

	@ViewChild('export') public exportComponent: ExportComponent;

	environment = environment;
	gamme = { titre: '', texte: '' };
	couleurGamme = 1;
	animation = -1;
	modele: Modele;
	iconeMecanisme;

	isReady = false;
	showSpecPopup = false;
	showSavePopup = false;
	showLoadPopup = false;
	optionsOpened: Array<boolean[]>;

	stringFromDetails(details: string[]): string {
		return this.produitService.fullString(details);
	}

	protected _destroy$ = new Subject<void>();
	protected _ID = 'Récapitulatif';

	constructor(
		protected configService: ConfigurateurService,
		protected router: Router,
		protected route: ActivatedRoute,
		protected produitService: ProduitService,
		public svg: SvgService
	) {
		this.optionsOpened = [new Array(10).fill(false), new Array(10).fill(false), new Array(10).fill(false), new Array(10).fill(false)];
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

	getProduitDetails(reference: string): Produit {
		return this.configService.produits.find(produit => produit.reference === reference);
	}

	/**
	 * Supprime une option de la solution complète.
	 * @param group Le groupe de l'option à supprimer
	 * @param categorie Le nom de la catégorie à supprimer
	 */
	delete(group: string, categorie: string, option?: Option): void {
		if (group === 'Services') {
			const options = this.configService.configuration.getOptions(group, categorie);
			options.find(o => o.option.produit.value === option.produit.value).quantite = 0;
			this.configService.configuration.setOptions(group, categorie, options);
		} else {
			this.configService.configuration.removeOptions(group, categorie);
		}
		setTimeout(() => this.configService.configurationChange.next(this._ID));
	}

	onClickOption(group: string, categorie: string, oldOption: { option: Option, quantite: number }, newOption: { option: Option, quantite: number }): void {
		this.configService.configuration.replaceOption(group, categorie, oldOption, newOption);
	}

	/**
	 * Indique le type de l'option :
	 * - equipement, pour des listes de produits dans une sliding liste
	 * - input, pour un champ libre
	 * - one, pour des choix uniques
	 * @param option Une option
	 * @returns string
	 */
	typeDeProduit(group: string, option: any): string {
		if (option?.option?.['Cible']) {
			if (group === 'Équipement additionnel') return 'equipement';
			if (group === 'Services') return 'services';
			if (this.configService.modeles.find(modele => modele.produit === this.configService.configuration.modele).crits[option.option['Cible']?.value]?.value.includes('à')) return 'input';
			return 'one';
		}
		return '';
	}

	optionsToOptions(options: any): any {
		return [...options.map(o => o.option)];
	}

  protected readonly faFilePdf = faFilePdf;
  protected readonly faPlayCircle = faPlayCircle;
  protected readonly faTimes = faTimes;
}
