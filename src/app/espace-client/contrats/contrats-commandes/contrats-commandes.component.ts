import {AfterViewInit, Component, EventEmitter, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AdresseService, LicenceCommandesService, SortAndFilterService, WindowService} from '@core/_services';
import {ProduitService} from '@core/_services/produit.service';
import {
  faBell,
  faBellSlash,
  faCheckCircle, faHistory,
  faMinusCircle,
  faPenSquare,
  faPlusCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import {TabSortComponent} from "@/_util/components/tab-sort/tab-sort.component";
import {CommonModule} from "@angular/common";
import {TooltipComponent} from "@/_util/components/tooltip/tooltip.component";
import {MatOptgroup, MatOption} from "@angular/material/core";
import {MatFormField, MatLabel, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatPaginator} from "@angular/material/paginator";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {EnduserFormComponent} from "@/_util/components/enduser-form/enduser-form.component";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {ContratsBaseComponent} from "@/espace-client/contrats/contrats-base.component";

@Component({
  selector: 'app-contrats-commandes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TooltipComponent,
    TabSortComponent,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
    MatLabel,
    MatFormField,
    MatInput,
    MatOptgroup,
    MatCheckbox,
    MatPaginator,
    FaIconComponent,
    EnduserFormComponent,
    RouterLink,
    CdkTextareaAutosize
  ],
  templateUrl: './contrats-commandes.component.html',
  styleUrls: ['../contrats.component.scss', './contrats-commandes.component.scss']
})
export class ContratsCommandesComponent extends ContratsBaseComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() public selectedTabIndexChange = new EventEmitter<number>();

  constructor(
    public licenceService: LicenceCommandesService,
    public produitService: ProduitService,
    protected fb: FormBuilder,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    public adresseService: AdresseService,
    protected ngZone: NgZone,
    protected window: WindowService,
    protected saf: SortAndFilterService
  ) {
    super(licenceService, produitService, fb, router, activatedRoute, adresseService, ngZone, window, saf);
    this._pageID = 'licence-commande';
  }

  protected readonly faPenSquare = faPenSquare;
  protected readonly faCheckCircle = faCheckCircle;
  protected readonly faTimesCircle = faTimesCircle;
  protected readonly faPlusCircle = faPlusCircle;
  protected readonly faMinusCircle = faMinusCircle;
  protected readonly faHistory = faHistory;
  protected readonly faBellSlash = faBellSlash;
  protected readonly faBell = faBell;
}
