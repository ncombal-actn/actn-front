import { ConfigurateurService, Option } from '@/configurateurs/configurateur.service';
import { Produit, User } from '@/_util/models';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthenticationService, ComponentsInteractionService } from '@core/_services';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import {faChevronUp, faTimes} from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: 'conf-resume',
	templateUrl: './resume.component.html',
	styleUrls: ['./resume.component.scss'],
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
export class ResumeComponent implements OnInit, OnDestroy, AfterViewInit {

	@Input()
	get recapOpen(): boolean {
		return this._recapOpen;
	}
	set recapOpen(value: boolean) {
		this._recapOpen = value;
		this.recapOpenChange.emit(value);
		setTimeout(() => {
			if (value) {
				this._state = State.OPENED;
			} else {
				this._state = State.CLOSED;
			}
		})
	}

	@Output() recapOpenChange = new EventEmitter<boolean>();

	@Output() showPrixLocatifChange = new EventEmitter<boolean>();

	public get showPrixLocatif(): boolean {
		return this._showPrixLocatif;
	}
	public set showPrixLocatif(value: boolean) {
		this._showPrixLocatif = value;
		this.showPrixLocatifChange.emit(value);
	}

	public get user(): User {
		return this.authService.currentUser;
	}

	protected _recapOpen = false;
	protected _showPrixLocatif = false;
	protected _state = State.CLOSED;
	protected _destroy$ = new Subject<void>();
	protected _ID = 'Résumé';

	constructor(
		public configService: ConfigurateurService,
		protected authService: AuthenticationService,
		public componentsInteractionService: ComponentsInteractionService,
		protected ngZone: NgZone
	) { }

	ngOnInit(): void {
		this.ngZone.runOutsideAngular(() => {
			fromEvent(window, 'click')
				.pipe(takeUntil(this._destroy$), debounceTime(20))
				.subscribe(() => this.onClickWindow());
			fromEvent(window, 'tap')
				.pipe(takeUntil(this._destroy$), debounceTime(20))
				.subscribe(() => this.onClickWindow());
			fromEvent(window, 'keydown')
				.pipe(
					takeUntil(this._destroy$),
					filter((key: KeyboardEvent) => key.key === 'Escape'),
					debounceTime(20))
				.subscribe(() => this.onEscapePress());
			fromEvent(window, 'mousemove')
				.pipe(takeUntil(this._destroy$), debounceTime(20))
				.subscribe(() => this.onMouseMove());

		});
	}

	ngAfterViewInit(): void {
		this.closeRecap();
		this._state = State.CLOSED;
	}

	ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	/**
	 * Évènement déclenché au clic sur l'élément Récapitulatif.
	 */
	onClickRecap(event: Event): void {
		event.stopPropagation();
		switch (this._state) {
			case State.CLOSED:
				this.openRecap();
				this._state = State.OPENIN;
				break;
			case State.OPENED:
				this.closeRecap();
				this._state = State.CLOSED;
				break;
			case State.OPENIN:
				this.closeRecap();
				this._state = State.CLOSED;
				break;
			case State.OPENOUT:
				this.closeRecap();
				this._state = State.CLOSED;
				break;
		}
	}

	/**
	 * Évènement déclenché lorsque la souris entre dans le bandeau déroulant.
	 */
	onMouseEnterRecap(): void {
		switch (this._state) {
			case State.CLOSED:
				// Impossible
				break;
			case State.OPENED:
				this._state = State.OPENIN;
				break;
			case State.OPENIN:
				// Impossible
				break;
			case State.OPENOUT:
				this._state = State.OPENIN;
				break;
		}
	}

	/**
	 * Évènement déclenché lorsque la souris sors du bandeau déroulant.
	 */
	onMouseLeaveRecap(): void {
		switch (this._state) {
			case State.CLOSED:
				// Impossible
				break;
			case State.OPENED:
				// Impossible
				break;
			case State.OPENIN:
				this._state = State.OPENOUT;
				break;
			case State.OPENOUT:
				// Impossible
				break;
		}
	}

	/**
	 * Évènement déclenché au clic dans la fenêtre.
	 */
	onClickWindow(): void {
		switch (this._state) {
			case State.CLOSED:
				// Rien
				break;
			case State.OPENED:
				break;
			case State.OPENIN:
				// Rien
				break;
			case State.OPENOUT:
				this.closeRecap();
				this._state = State.CLOSED;
				break;
		}
	}

	/**
	 * Évènement déclenché lorsque la touche Échap est pressée.
	 */
	onEscapePress(): void {
		switch (this._state) {
			case State.CLOSED:
				// Rien
				break;
			case State.OPENED:
				this.closeRecap();
				this._state = State.CLOSED;
				break;
			case State.OPENIN:
				this.closeRecap();
				this._state = State.CLOSED;
				break;
			case State.OPENOUT:
				this.closeRecap();
				this._state = State.CLOSED;
				break;
		}
	}

	onMouseMove(): void {
		switch (this._state) {
			case State.CLOSED:
				// Rien
				break;
			case State.OPENED:
				this._state = State.OPENOUT;
				break;
			case State.OPENIN:
				// Rien
				break;
			case State.OPENOUT:
				// Rien
				break;
		}
	}

	/**
	 * Supprime une option de la solution complète.
	 * @param categorie Le nom de la catégorie à supprimer
	 */
	onClickDelete(group: string, categorie: string, option?: Option): void {
		if (group === 'Services') {
			const options = this.configService.configuration.getOptions(group, categorie);
			options.find(o => o.option.produit.value === option.produit.value).quantite = 0;
			this.configService.configuration.setOptions(group, categorie, options);
		} else {
			this.configService.configuration.removeOptions(group, categorie);
		}
		setTimeout(() => this.configService.configurationChange.next(this._ID));
	}

	/**
	 * Ouvre le récapitulatif.
	 */
	openRecap(): void {
		this.ngZone.run(() => {
			this.recapOpen = true;
			this.recapOpenChange.emit(this.recapOpen);
		});
	}

	/**
	 * Ferme le récapitulatif.
	 */
	closeRecap(): void {
		this.ngZone.run(() => {
			this.recapOpen = false;
			this.recapOpenChange.emit(this.recapOpen);
		});
	}

	getProduitDetails(reference: string): Produit {
		return this.configService.produits.find(produit => produit.reference === reference);
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

  protected readonly faChevronUp = faChevronUp;
  protected readonly faTimes = faTimes;
}

enum State {
	CLOSED,
	OPENED,
	OPENIN,
	OPENOUT
}
