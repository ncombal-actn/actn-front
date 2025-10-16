import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FinanceService} from "@services/finance.service";
import {MatSort} from "@angular/material/sort";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService, CartService} from "@core/_services";
import {faFilePdf} from "@fortawesome/free-solid-svg-icons";
import {Finance} from "@/_util/models/finance";
import {SelectionModel} from "@angular/cdk/collections";
import {environment} from "@env";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatFooterCell, MatFooterCellDef, MatFooterRow, MatFooterRowDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {CommonModule} from "@angular/common";
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";
import {MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker, MatEndDate} from "@angular/material/datepicker";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TooltipComponent} from "@/_util/components/tooltip/tooltip.component";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleWLineComponent,
    MatDatepickerToggle,
    MatDateRangeInput,
    MatDateRangePicker,
    MatFormField,
    MatLabel,
    MatTable,
    MatRadioGroup,
    MatRadioButton,
    FormsModule,
    MatInput,
    MatButton,
    FaIconComponent,
    TooltipComponent,
    MatCheckbox,
    MatIcon,
    MatEndDate,
  ],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
  animations: [
    /**
     * Animation sur la hauteur de l'élément, alterne entre 0 et sa hauteur par défaut.
     * ! Ajouter directement overflow: hidden sur l'élément concerné si besoin de masquer son contenu.
     * L'ajout de cet attribut par l'animation ne fonctionne pas sur Safari !
     */
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
export class FinanceComponent  implements OnInit{

  bic: string;
  iban: string;

  constructor(
    public _financeService: FinanceService,
    public authService: AuthenticationService,
    public cartService: CartService
  ) {

  }

  @ViewChild(MatSort) sort: MatSort;

  columnsEchus: string[] = ['nfacture', 'refclient', 'date', 'echeance', 'libelle', 'montant'];

  columnsEchusPourVrai: string[] = ['select', 'nfacture', 'refclient', 'date', 'echeance', 'libelle', 'montant'];

  selection = new SelectionModel<Finance>(true, []);

  collapsedIdsArray: string[] = [];

  settlementPopUp: boolean = false;

  totalPrix: number = 0;

  modePaiement: string = '';

  emailCb: FormControl = new FormControl<string>('', [Validators.required, Validators.email]);

  nFacture: string = '';



  campaignOne = new FormGroup({
    start: new FormControl(''),
    end: new FormControl(''),
  });

  campaignTwo = new FormGroup({
    start: new FormControl(''),
    end: new FormControl(''),
  });

  nFactureFiltre = new FormControl('');
  refClientFiltre = new FormControl('');


ngOnInit(): void {
    this._financeService.getListOfFinance();
    this.cartService.getBic().subscribe(data => this.bic = data);
    this.cartService.getIban().subscribe(data => this.iban = data);
}

  /**
   * Ouvre ou ferme un élément.
   * @param event L'élément DOM déclencheur
   * @param id L'identifiant de l'élément
   */
  toggleCollapseDivById(event, id: string): void {
    // On vérifie que l'on a pas à faire à un sous-évenement pour ne pas déclencher plusieurs fois le handler.
    if (!event.srcEvent) {
      if (this.collapsedIdsArray.includes(id)) {
        this.collapsedIdsArray.splice(this.collapsedIdsArray.indexOf(id), 1); // retirer l'id de collapsedIdsArray
      }
      else {
        this.collapsedIdsArray.push(id);
      }
    }
  }

  filtrer(event, type, champ){
    this._financeService.applyFilter(event, type, champ);
    this.reOpenDiv();
  }

  reOpenDiv(){
    this.collapsedIdsArray = [];
  }

  checkboxLabel(row?: Finance): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this._financeService.filteredAlertItems.getValue());
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this._financeService.filteredAlertItems.getValue().length;
    return numSelected === numRows;
  }

  settlement(){
    this.settlementPopUp = true;
    this._calculePrix();
    this._concatFacture();
  }

  private _concatFacture(){
    this.nFacture = '';
    this.selection.selected.forEach((e, i, arr) => {
      if(i === arr.length - 1){
        this.nFacture += e.nfacture;
      }else{
        this.nFacture += e.nfacture + ' ';
      }
    });
  }

  private _calculePrix(){
    this.totalPrix = 0;
    this.selection.selected.forEach((e) => {
      this.totalPrix += (Number(e.debit) + Number(e.credit));
    });
    this.totalPrix = Number(this.totalPrix.toFixed(2));
  }

  giveMoula(){
    if(this.emailCb.valid){
      this._financeService.payer(this.emailCb.value.toLowerCase(), this.totalPrix.toString().replace('.', ','), this.nFacture);
    }
  }

  getErrorMessage() {
    if (this.emailCb.hasError('required')) {
      return 'Veuillez entrer une adresse mail';
    }

    return this.emailCb.hasError('email') ? 'Adresse mail non valide' : '';
  }

  public disableCheckbox(id): boolean {
    return this.selection.selected.length >= 8 && !this.selection.selected.includes(id);
  }

  protected readonly faFilePdf = faFilePdf;
  protected readonly environment = environment;
}
