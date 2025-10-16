import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
	AuthenticationService,
	ComponentsInteractionService,
	UserService
} from '@core/_services';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import { LicenceService } from '@core/_services/licence.service';
import { CotationService } from '@core/_services/cotation.service';
import {
  faBarcode, faChartLine, faCloud,
  faEuroSign,
  faFileInvoice, faHeadset, faHome, faKey, faMoneyBill, faMoneyBillWave, faMoneyCheck, faNewspaper,
  faReceipt, faSave,
  faShoppingCart,
  faSignOutAlt, faTag, faTruck, faUndo,
  faUser, faUserCog, faWrench
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatTooltip} from "@angular/material/tooltip";
import {LoginFormComponent} from "@/_util/components/login-form/login-form.component";

/**
 * Panneau de navigation latéral
 */
@Component({
	selector: 'app-side-nav',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink, MatTabGroup, MatTab, RouterLinkActive, MatTooltip, LoginFormComponent],
	templateUrl: './side-nav.component.html',
	styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {

	@Input() currentMenu = '';
	@Output() currentMenuChange = new EventEmitter<string>();
	/**
	 * Event de connection pour recharger les ressources du header
	 */
	@Output() EventLog = new EventEmitter<void>();

	/**
	 * True si le panneau doit resté ouvert.
	 */
	locked = false;
	menuRMA = false;
	menuFinance = false;

	interactionServiceSub;
	nbrOfCriticalCotations:number;
	userID = '';

	private _destroy$ = new Subject<void>();

	constructor(
		public authService: AuthenticationService,
		public componentsInteractionService: ComponentsInteractionService,
		private router: Router,
		public licenceService: LicenceService,
		private cotationService: CotationService,
		public userService: UserService,
		@Inject(PLATFORM_ID) private platformId: Object
	) { }

	/**
	 * Fermer le panneau de navigation latéral. Fermeture bloquée si locked est à true.
	 */
	close(): void {
		this.currentMenuChange.next(this.locked ? this.currentMenu : '');
		this.menuRMA = false;
		this.menuFinance = false;
	}

	show(): void {
		this.menuRMA = !this.menuRMA;
	}

  showFinance(): void {
		this.menuFinance = !this.menuFinance;
	}

	logOut(): void {
		this.authService.logout();
		this.close();
		this.router.navigate(['/']);
		this.EventLog.emit();
	}

	ngOnInit(): void {
		// Subscription sur l'évenement "onOpenSideNav" pouvant être déclenché par des composants distants.
		this.interactionServiceSub = this.componentsInteractionService.sideNavigationLine.onOpenSideNav$
			.pipe(takeUntil(this._destroy$))
			.subscribe(selectedMenu => {
				if (selectedMenu == 'toggleEspaceClient') {
					if (this.currentMenu == 'espaceClient') { selectedMenu = ''; }
					else { selectedMenu = 'espaceClient'; }
				}

				if (selectedMenu == 'toggleFavorisPreview') {
					if (this.currentMenu == 'favorisPreview') { selectedMenu = ''; }
					else { selectedMenu = 'favorisPreview'; }
				}

				if (selectedMenu == 'togglePanierPreview') {
					if (this.currentMenu == 'panierPreview') { selectedMenu = ''; }
					else { selectedMenu = 'panierPreview'; }
				}

				this.currentMenuChange.next(selectedMenu);
			});

		this.authService.currentUser$
			.pipe(takeUntil(this._destroy$))
			.subscribe(user => {
				if (user) {
					this.userID = user.id.toString().replace(/^0*/g, '');
				} else {
					this.userID = '';
				}
			});

			if (isPlatformBrowser(this.platformId)) {
				const storedCotations = sessionStorage.getItem('cotationData');
				if (storedCotations) {
				  const cotations = JSON.parse(storedCotations);
				  this.nbrOfCriticalCotations = cotations.nbrOfCriticalCotations;



				}
			  }
	}

	ngOnDestroy(): void {
		this.interactionServiceSub.unsubscribe();
		this._destroy$.next();
		this._destroy$.complete();
	}

  protected readonly faUser = faUser;
  protected readonly faSignOutAlt = faSignOutAlt;
  protected readonly faShoppingCart = faShoppingCart;
  protected readonly faFileInvoice = faFileInvoice;
  protected readonly faReceipt = faReceipt;
  protected readonly faEuroSign = faEuroSign;
  protected readonly faSave = faSave;
  protected readonly faUndo = faUndo;
  protected readonly faMoneyCheck = faMoneyCheck;
  protected readonly faWrench = faWrench;
  protected readonly faTag = faTag;
  protected readonly faBarcode = faBarcode;
  protected readonly faHeadset = faHeadset;
  protected readonly faUserCog = faUserCog;
  protected readonly faKey = faKey;
  protected readonly faChartLine = faChartLine;
  protected readonly faHome = faHome;
  protected readonly faTruck = faTruck;
  protected readonly faNewspaper = faNewspaper;
  protected readonly faCloud = faCloud;
  protected readonly faMoneyBill = faMoneyBill;
  protected readonly faMoneyBillWave = faMoneyBillWave;
}
