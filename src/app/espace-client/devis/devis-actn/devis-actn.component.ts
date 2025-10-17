import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DevisBaseComponent} from '../devis-base.component';
import {Devis} from '@core/_services/devis.service';
import {fromEvent} from 'rxjs';
import {debounceTime, skip, take, takeUntil} from 'rxjs/operators';
import {TabSortComponent} from "@/_util/components/tab-sort/tab-sort.component";
import {AsyncPipe, CurrencyPipe, DatePipe, KeyValuePipe, NgClass, NgStyle, SlicePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatPaginator} from "@angular/material/paginator";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TooltipComponent} from "@/_util/components/tooltip/tooltip.component";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";

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
    SlicePipe,
    MatSelect,
    MatOption,
    MatInput
  ],
  templateUrl: './devis-actn.component.html',
  styleUrls: ['../devis.component.scss']
})
export class DevisActnComponent extends DevisBaseComponent implements OnInit {

  @Output() public Refresh = new EventEmitter<Devis>();
  @Output() public Edit = new EventEmitter<Devis>();

  override onShowRefreshDevis(devis: Devis) {
    this.Refresh.emit(devis);
  }

  override onShowEditPopup(devis: Devis) {
    this.Edit.emit(devis);
  }

  override ngOnInit(): void {
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
        // Différence principale : filtre sur 'DEV' au lieu de 'PRW'
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
      fromEvent(this.windowService.nativeWindow.document, 'scroll')
        .pipe(
          skip(1),
          debounceTime(20),
          takeUntil(this._destroy$))
        .subscribe(() => {
          this.devisService.scroll = this.windowService.pageYOffset;
        });
    });
  }
}
