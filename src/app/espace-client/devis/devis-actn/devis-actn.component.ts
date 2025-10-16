import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@core/_services/authentication.service';
import { CartService } from '@core/_services/cart.service';
import { Devis, DevisService } from '@core/_services/devis.service';
import { ProduitService } from '@core/_services/produit.service';
import { SortAndFilterService } from '@core/_services/sort-and-filter.service';
import { WindowService } from '@core/_services/window/window.service';
import { fromEvent } from 'rxjs';
import { debounceTime, skip, take, takeUntil } from 'rxjs/operators';
import { DevisComponent } from '../devis.component';
import {faCheck, faFilePdf, faMinus, faPlus, faRedoAlt} from "@fortawesome/free-solid-svg-icons";
import {TabSortComponent} from "@/_util/components/tab-sort/tab-sort.component";
import {AsyncPipe, CurrencyPipe, DatePipe, KeyValuePipe, NgClass, NgStyle, SlicePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatPaginator} from "@angular/material/paginator";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TooltipComponent} from "@/_util/components/tooltip/tooltip.component";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";

@Component({
	selector: 'app-devis-actn',
  standalone: true,
  imports: [
    AsyncPipe,
    KeyValuePipe,
    FormsModule,
    TabSortComponent,
    MatFormField,
    MatLabel,
    MatPaginator,
    FaIconComponent,
    NgStyle,
    CurrencyPipe,
    NgClass,
    TooltipComponent,
    DatePipe,
    MatTooltip,
    MatIcon,
    SlicePipe
  ],
	templateUrl: './devis-actn.component.html',
	styleUrls: ['../devis.component.scss']
})
export class DevisActnComponent extends DevisComponent implements OnInit {
	constructor(
		public authService: AuthenticationService,
		protected router: Router,
		protected cartService: CartService,
		protected devisService: DevisService,
		public saf: SortAndFilterService,
		protected produitService: ProduitService,
		protected activatedRoute: ActivatedRoute,
		protected ngZone: NgZone,
		protected window: WindowService) {
		super(authService, router, cartService, devisService, saf, produitService, activatedRoute, ngZone, window);
	}

	@Output() public Refresh = new EventEmitter<Devis>();

	onShowRefreshDevis(devis: Devis){
		this.Refresh.emit(devis);
	}

	@Output() public Edit = new EventEmitter<Devis>();

	onShowEditPopup(devis: Devis){
		this.Edit.emit(devis);
	}



    cleanFilter(type: string, array:string): void {
        /**Filtre marque */
        if (type === 'produits.marquelib'){
            this.marquesSelected = [];
            this.onSearch(type, 'array', 'includes', '', array)

        }else{
            /**Filtre status */
            setTimeout(() => this.processedDevis$.next(this.saf.onFiltre('devis', 'statut', 'string', 'includes', '', this._devis)), 1);
        }
    }

	ngOnInit(): void {
        this.processedDevis$
            .pipe(skip(1), takeUntil(this._destroy$))
            .subscribe(() => {
                this.paginator.low = 0;
                this.paginator.high = this.paginator.pageSize;
                this.paginator.pageIndex = 0;
            });

        this.devisService.getDevis()
            .pipe(take(1), takeUntil(this._destroy$))
            .subscribe(devis => {
                this._devis = devis.filter(devis => devis.transactioncode === 'DEV');
                const s = new Set<string>();
                this._devis.forEach(d => {
                    d.produits.forEach(p => this.marqueArray.set(p.marque, p.marquelib));
                    s.add(d.statut);
                });
                this.statutArray = Array.from(s).sort((s1, s2) => s1.localeCompare(s2));
                this.saf.setTri('devis', 'datecommande', 'date', 'desc');
                this.marquesSelected = this.saf.getFiltre('devis', 'produits.marquelib', 'includes') as Array<string> || [];
                this.processedDevis$.next(this.saf.filtrer('devis', this._devis));
            });

        this.ngZone.runOutsideAngular(() => {
            fromEvent(window.document, 'scroll')
                .pipe(
                    skip(1),
                    debounceTime(20),
                    takeUntil(this._destroy$))
                .subscribe(() => {
                    this.devisService.scroll = this.window.pageYOffset;
                });
        });
	}

  protected readonly faFilePdf = faFilePdf;
  protected readonly faPlus = faPlus;
  protected readonly faMinus = faMinus;
  protected readonly faCheck = faCheck;
  protected readonly faRedoAlt = faRedoAlt;
}
