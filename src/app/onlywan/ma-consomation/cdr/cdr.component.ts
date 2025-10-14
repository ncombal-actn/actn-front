import { SelectionModel } from "@angular/cdk/collections";
import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  Component,

  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SortAndFilterService } from "@core/_services";
import { environment } from "@env";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import {WorkBook, WorkSheet, utils, writeFile } from 'xlsx';

@Component({
  selector: "app-cdr",
  templateUrl: "./cdr.component.html",
  styleUrls: ["./cdr.component.scss"],
})
export class CdrComponent implements OnInit,  OnDestroy,AfterViewInit {
  displayedColumns: string[] = [
    "select",
    "callId",
    "dateappel",
    "numerofacture",
    "numeroappel",
    "duree",
    "destination",
    "nomuser",
    "prixvente",
  ];
  dataSource = new MatTableDataSource<any>();
  totalPrixVente = 0;
  totalTemps = 0;
  listeClients: any[] = [];
  clientsUniques: any[] = [];
  tests: any[] = [];
  tabCdr:any[] = [];
  nomSelected: Array<string> = [];
  destination: Array<string> = [];
  numeroappel: Array<string> = [];
  numerofacture: Array<string> = [];
  dateappel: Date ;
  dateappel2: Date;
  public selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 // @ViewChild("input", { static: false }) inputElement: ElementRef;
  valeurSelectionnee: any;
  isFiltering = false;
  done = false;
  //range:FormGroup;
  zozo =false;
  processedCdr$ = new BehaviorSubject<Array<any>>([]);
 // processedFiltre$  = new BehaviorSubject<Array<any>>([]);
  filtreArray: any[] = [];
  customHeaders = [
    "CALL-ID",
    "DATE-APPEL",
    "FORFAIT",
    "NUMERO-FACTURE",
    "NUMERO-APPEL",
    "DUREE",
    "DESTINATION",
    "NOM-UTILISATEUR",
    "PRIX-VENTE",
    "URL",
    "NUMERO-SPECIAL-PRIX-XMN"
  ];
  filtresForm: FormGroup;
  private _destroy$ = new Subject<void>();

  constructor(
    public http: HttpClient,
    private fb: FormBuilder,
    public saf: SortAndFilterService
  ) {}
  //allComplete: boolean = false;

  ngOnInit(): void {
    this.filtresForm = this.fb.group({
      nomuser: new FormControl<string[] | null>(null),
      dateappel: new FormControl<any | null>(null),
      dateappel2: new FormControl<any | null>(null),
      numeroappel:new FormControl<string[] | null>(null),
      numerofacture :new FormControl<string[] | null>(null),
      destination:new FormControl<string[] | null>(null),
    });

    this.instanceFilter()
    /*
    this.range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    });
    */

    this.http
      .get<any[]>(`${environment.apiUrl}ListeCDRonlywan.php`, {
        withCredentials: true,
        //responseType: 'json'
      })
      .subscribe((data) => {
        data.forEach((data) => {
          data.dateappel = new Date(data.dateappel);
          data.dateappel.setHours(0,0,0,0);
          data.dateappel2 = new Date(data.dateappel2);
          data.dateappel2.setHours(0,0,0,0);
        });
        this.listeClients = data;
       this.clientsUniques = this.getUniqueValues(this.listeClients, "nom");
        this.processedCdr$.next(data);
        this.processedCdr$.pipe(takeUntil(this._destroy$))
        .subscribe((d) => {
          this.dataSource.data = d;
          this.tests = this.getUniqueValues(this.listeClients, "nomuser");
        });
       /*  this.processedFiltre$.subscribe((d)=>{

        this.selection.selected.push(d) On fera
        })
      */
    //    this.done =true
        this.zozo =true
        this.toggleAllRows();
        this.calculerTotalPrixVente();
        /* setTimeout(()=>{
        },50) */
      });
  }
  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
   // this.processedCdr$.next();
   this.processedCdr$.unsubscribe();
  // this.processedCdr$.complete();

  this.resetPaginatorAndSort()

  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  resetPaginatorAndSort() {
    if (this.paginator) {
      this.paginator.firstPage();
    }

    if (this.sort) {
      this.sort.active = '';
      this.sort.direction = 'asc';
    }
  }

  getUniqueValues(liste: any[], key: string): any[] {
    const uniqueValues: any[] = [];
    const seenValues: Set<any> = new Set();

    liste.forEach((item) => {
      const value = item[key];
      if (!seenValues.has(value)) {
        seenValues.add(value);
        uniqueValues.push(value);
      }
    });

    // this.tests= uniqueValues;

    return uniqueValues;

  }
  test(){
    this.filtresForm.get('dateappel').setValue("");
    this.filtresForm.get('dateappel2').setValue("");
    this.dateappel =null
    this.dateappel2 =null

    //this.filtresForm.get(filter).setValue('');
  }

  /* resetFilters() {
    this.dataSource.data = [];
    this.dataSource.data = this.listeClients;
  } */

  /* filtrerTableau(): void {
    if (this.valeurSelectionnee) {
      const dataFiltree = this.listeClients.filter(
        (client) => client.nom === this.valeurSelectionnee
      );
      this.processedCdr$.next(dataFiltree);
    } else {
      this.processedCdr$.next(this.listeClients);
    }
  } */

  calculerTotalPrixVente() {
    this.totalPrixVente = 0; // Réinitialiser le total à 0 avant le calcul

    this.totalTemps = 0;
    for (const client of this.selection.selected) {
      this.totalTemps += parseFloat(client.duree);
      this.totalPrixVente += parseFloat(client.prixvente);
    }
  }
  /* calculerTotalTemps() {
    // Réinitialiser le total à 0 avant le calcul

     // Parcourir la liste des clients et accumuler les valeurs de "client.prixvente"

   } */

 /*  clearInput() {
    // Réinitialiser la valeur de l'input à une chaîne vide
    this.inputElement.nativeElement.value = "";
    const filterValue = "";
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } */

  filtreDate(target: string, type: string, method: string, event, values?: string){
    if (values) {
      setTimeout(() => this.processedCdr$.next(this.filtreDateDeep(method, this[values], this.listeClients)), 1);

    this.selection.clear();
    this.totalPrixVente = 0; // Réinitialiser le total à 0 avant le calcul
    this.totalTemps = 0;
    while (this.selection.selected.length) {
      this.selection.selected.pop();
    }
    } else {
      setTimeout(() => this.processedCdr$.next(this.filtreDateDeep(method, this[values], this.listeClients)), 1);

    }
  }

  filtreDateDeep(method:string,event:Date,values:Date[]):any{
    const filterValue = event as Date;
    if (method ==="GE") {
      return values.filter((d: Date) => d.getTime() >= filterValue.getTime());
    }else{
      return values.filter((d: Date) => d.getTime() <= filterValue.getTime());
    }

  }

  onSearch(target: string, type: string, method: string, event, values?: string): void{
    if (values) {
      if (type ==="date") {

        this.selection.clear();
        this.totalPrixVente = 0; // Réinitialiser le total à 0 avant le calcul

        this.totalTemps = 0;
        while (this.selection.selected.length) {
          this.selection.selected.pop();
        }
        setTimeout(() => this.processedCdr$.next(this.saf.onFiltre('cdr', target, type, method, this[values], this.listeClients)), 1);
        return
      }
      setTimeout(() => this.processedCdr$.next(this.saf.onFiltre('cdr', target, type, method, this[values], this.listeClients)), 1);
      //setTimeout(() => this.processedFiltre$.next(this.saf.onFiltre('filtre', target, type, method, this[values], this.selection.selected)), 1);
      //  this.selection.select(...this.saf.onFiltre('cdr', target, type, method, this[values], this.listeClients));
      this.selection.clear();
      this.totalPrixVente = 0; // Réinitialiser le total à 0 avant le calcul

      this.totalTemps = 0;
      while (this.selection.selected.length) {
        this.selection.selected.pop();
      }


      //this.selection.select(...this.dataSource.data);
    } else {
      setTimeout(() => this.processedCdr$.next(this.saf.onFiltre('cdr', target, type, method, event['target'].value != null ? event['target'].value : event['target'].innerText, this.listeClients)), 1);

      //setTimeout(() => this.processedFiltre$.next(this.saf.onFiltre('filtre', target, type, method, event['target'].value != null ? event['target'].value : event['target'].innerText, this.selection.selected)), 1);
      // this.selection.select(...this.dataSource.data);
      /* this.selection.clear();
      while (this.selection.selected.length) {
        this.selection.selected.pop();
      }
      //this.selection.selected = [];


      this.totalPrixVente = 0; // Réinitialiser le total à 0 avant le calcul

    this.totalTemps = 0; */
      //this.selection.select(...this.dataSource.data);
    }
  }
  resetOneFilters(filter: string) {
    // RESET ONE FILTERS
    this.filtresForm.get(filter).setValue('');
    this.saf.resetFiltre('cdr', filter + 'includes');
    this.processedCdr$.next(this.saf.filtrer('cdr', this.listeClients));
  }
  resetDate(){
    this.filtresForm.get('start').setValue('');
    this.filtresForm.get('end').setValue('');
    this.saf.resetFiltre('cdr', 'dateappel' + 'date');
    this.saf.resetFiltre('cdr', 'dateappel2' + 'date');
    this.processedCdr$.next(this.saf.filtrer('cdr', this.listeClients));
  }


 // ngAfterViewInit(): void {
  //  this.toggleAllRows();
   // this.calculerTotalPrixVente();

    //this.tests = this.getUniqueValues(this.listeClients,'nomuser')
  //}
 /*  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }  */

  /** Whether the number of selected elements matches the total number of rows. */
  applyFilter2(selectedValues: string[]) {


    /*  const filterValue = event;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  } */
    // Vérifiez si des valeurs sont sélectionnées
    if (selectedValues.length === 0) {
      this.dataSource.data = this.listeClients;
    } else {
      // Si des valeurs sont sélectionnées, créez un filtre pour les inclure dans le résultat
      this.dataSource.data = this.listeClients.filter((client) =>
        selectedValues.includes(client.nomuser)
      );
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  instanceFilter(){
    //this.processedCdr$.next(this.marquesCommande.sort());
    this.dateappel = this.saf.getFiltre('cdr', 'dateappel', 'date') as Date || null ;
    this.dateappel2 = this.saf.getFiltre('cdr', 'dateappel2', 'date') as Date || null;
    this.nomSelected = this.saf.getFiltre('cdr', 'nomuser', 'includes') as Array<string> || [];
    this.numerofacture = this.saf.getFiltre('cdr', 'numerofacture', 'includes') as Array<string> || [];
    this.numeroappel = this.saf.getFiltre('cdr', 'numeroappel', 'includes') as Array<string> || [];
    this.destination = this.saf.getFiltre('cdr', 'destination', 'includes') as Array<string> || [];

    this.processedCdr$.next(this.saf.filtrer('cdr', this.tabCdr));
    this.processedCdr$.subscribe((d) => {
      this.dataSource.data = d;
    })
   /*  this.FnomSelected = this.saf.getFiltre('filtre', 'nomuser', 'includes') as Array<string> || [];
    this.Fnumerofacture = this.saf.getFiltre('filtre', 'numerofacture', 'includes') as Array<string> || [];
    this.Fnumeroappel = this.saf.getFiltre('filtre', 'numeroappel', 'includes') as Array<string> || [];
    this.Fdestination = this.saf.getFiltre('filtre', 'destination', 'includes') as Array<string> || []; */

  /*   this.processedFiltre$.next(this.saf.filtrer('filtre', this.tabCdr));
    this.processedFiltre$.subscribe((d) => {
      this.dataSource.data = d;
    }) */
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  resetFilters() {
    // RESET FILTERS

    this.filtresForm.setValue({
      nomuser:'',
      numerofacture: '',
      numeroappel :'',
      destination:'',
    //  recherche: '',
    dateappel:'',
    dateappel2:'',
    });

    this.saf.resetFiltre('cdr', 'nomuser');
    this.saf.resetFiltre('cdr', 'numerofacture');
    this.saf.resetFiltre('cdr', 'numeroappel');
    this.saf.resetFiltre('cdr', 'destination');
    this.saf.resetFiltre('cdr', 'dateappel');
    this.saf.resetFiltre('cdr', 'dateappel2');
    this.processedCdr$.next(this.saf.filtrer('cdr', this.listeClients))

  }

  // Fonction de filtrage personnalisée pour les dates
  filtrerParDates() {
    // Filtrer le tableau "listeClients" en fonction des dates spécifiées
    const dateArray = [];
    this.dataSource.data.filter((client) => {
    // Convertir les dates du client en objets Date
     const dateClient = client.dateappel;
     const dateDebut = this.dateappel //this.filtresForm.get("start").value;
    //dateDebut = new Date(dateDebut);
      const dateFin = this.dateappel2 //this.filtresForm.get("end").value;

     // dateFin = new Date(dateFin);
    // Comparer si la date du client se situe entre les dates de début et de fin
    // Le résultat de la comparaison est true si la date du client est égale ou postérieure à la date de début et inférieure ou égale à la date de fin
      if (dateClient >= dateDebut && dateClient <= dateFin) {
        dateArray.push(client);
      }
    });

    this.processedCdr$.next(dateArray);

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;


    this.calculerTotalPrixVente();
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
   // this.processedCdr$.subscribe((d)=>{
    //this.dataSource.data = d;

    if (this.isAllSelected()) {
      this.selection.clear();

      return;
    }

    this.calculerTotalPrixVente();

    this.selection.select(...this.dataSource.data);
  //})
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      this.calculerTotalPrixVente();
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    this.calculerTotalPrixVente();
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  downlaodCsv() {
    //get(this.selection._selected)
    /*const csvContent = this.convertArrayToCSV(
      this.selection.selected,
      this.customHeaders
    );
    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "donnees_utilisateurs.csv";
    link.click();

    window.URL.revokeObjectURL(url);*/
    const ws: WorkSheet = utils.json_to_sheet(this.selection.selected);
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'CDR');
    writeFile(wb, 'donnees_utilisateurs.xlsx');
  }

  convertArrayToCSV(data: any[][], customHeaders: string[]) {
    const csvRows = [];
    csvRows.push('\uFEFF');
    // Create the header row
      // Add column width formatting



    const keys = Object.keys(data[0]).filter((key) => key !== "dateappel2"  );//|| "" || ""

    const headerRow = customHeaders.map(
      (header) => `"${String(header).replace(/"/g, '""')}"`
    );
    csvRows.push(headerRow.join(";"));

    /* // Create the data rows
    for (const obj of data) {
      const dataRow = keys.map((key) => {
        // Escape double quotes and wrap each value in double quotes to handle special characters properly
        return `"${String(obj[key]).replace(/"/g, '""')}"`;
      });

      csvRows.push(dataRow.join(";"));
    }
 */
// Create the data rows
for (const obj of data) {
  const dataRow = keys.map((key) => {
    if (key === "dateappel" && obj[key] && obj[key].date) {
      return `"${this.formatDate(new Date(obj[key].date))}"`;
    }
    // Vérifiez si la valeur doit être exclue (par exemple, si la valeur est 'exclure')
    if (key === 'dateappel2') {
      return null; // Ne rien ajouter à la ligne CSV
    }
    if (obj[key] === "" || obj[key] === null) {
      return ""; // Ne rien ajouter à la ligne CSV
    }
    return `"${String(obj[key]).replace(/"/g, '""')}"`;
  });

  csvRows.push(dataRow.join(";"));
}
    return csvRows.join("\n");
  }



}
