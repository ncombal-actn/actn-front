import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SortAndFilterService } from '@core/_services';
import { environment } from '@env';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent  implements OnInit, OnDestroy{
  protected environment = environment;
  displayedColumns: string[] = ['select','nom_facture','numero_facture','date_facture','montant_ht', 'montant_tva','montant_ttc' ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public selection = new SelectionModel<any>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input', { static: false }) inputElement: ElementRef;
  processedClient$ = new BehaviorSubject<Array<any>>([]);
  customHeaders = ['NUMERO-FACTURE', 'DATE-FACTURE','MONTANT-TTC', 'MONTANT-HT','MONTANT-TVA','NOM-FACTURE',];
   protected readonly faFilePdf = faFilePdf;
   filtresForm:FormGroup;
   nomSelected: Array<string> = [];
  destination: Array<string> = [];
  numeroappel: Array<number> = [];
  numeroappel2: Array<number> = [];
  numerofacture: Array<string> = [];
  tabFacture:any[] = [];
  tests=[]
   total={
    'totalHT': 0,
    'totalTVA': 0,
    'totalTTC': 0,

   }
   listeFactures:any[]=[];
   constructor(public http: HttpClient,public fb: FormBuilder, public saf: SortAndFilterService){

  }
  allComplete: boolean = false;

  ngOnInit(): void {
    this.filtresForm = this.fb.group({
      //nom_facture: new FormControl<String[] | null>(null),
      /* start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null), */
      /* numero_facture:new FormControl<String[] | null>(null),
      numerofacture :new FormControl<String[] | null>(null),
      montant_ht:new FormControl<String[] | null>(null),
      zozo:new FormControl<String[] | null>(null),
      montant_tva:new FormControl<String[] | null>(null),
      montant_ttc:new FormControl<String[] | null>(null) */
    });
    this.instanceFilter();
    this.http.get<any[]>(`${environment.apiUrl}ListeFAConlywan.php`,{
      withCredentials: true,
      //responseType: 'text'
    }).subscribe(
      (data) =>{
        this.listeFactures = data;
        this.processedClient$.next(data)
        this.processedClient$.subscribe((d) => {
          this.dataSource.data = d;
        })
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.toggleAllRows()
        this.initializeDefaultSort();
      }
    );
  }
  ngOnDestroy(): void {
    this.processedClient$.complete();
  }
  clearInput() {
    // Réinitialiser la valeur de l'input à une chaîne vide
    this.inputElement.nativeElement.value = '';
    const filterValue = "";
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  initializeDefaultSort() {
    if (this.dataSource.data && this.dataSource.data.length > 0) {
      this.sort.sort({
        id: 'date_facture', // Remplacez 'clientreference' par la colonne par laquelle vous souhaitez trier par défaut
        start: 'desc', // Remplacez 'asc' par 'desc' si vous souhaitez un tri descendant par défaut
        disableClear: true
      });
    }
  }

  onSearch(target: string, type: string, method: string, event, values?: string): void{
    if (values) {
      setTimeout(() => this.processedClient$.next(this.saf.onFiltre('facture', target, type, method, this[values], this.listeFactures)), 1);
    //setTimeout(() => this.processedFiltre$.next(this.saf.onFiltre('filtre', target, type, method, this[values], this.selection.selected)), 1);
    //this.selection.select(...this.saf.onFiltre('cdr', target, type, method, this[values], this.listeClients));
      this.selection.clear();
      this.total.totalHT = 0; // Réinitialiser le total à 0 avant le calcul
      this.total.totalTTC = 0
      this.total.totalTVA = 0
    while (this.selection.selected.length) {
      this.selection.selected.pop();
    }

      //this.selection.select(...this.dataSource.data);
    } else {
      setTimeout(() => this.processedClient$.next(this.saf.onFiltre('facture', target, type, method, event['target'].value != null ? event['target'].value : event['target'].innerText, this.listeFactures)), 1);

    }
  }
  instanceFilter(){
    //this.processedClient$.next(this.marquesCommande.sort());
    this.nomSelected = this.saf.getFiltre('facture', 'nomuser', 'includes') as Array<string> || [];
    this.numerofacture = this.saf.getFiltre('facture', 'numerofacture', 'includes') as Array<string> || [];
    this.numeroappel = this.saf.getFiltre('facture', 'number', 'GE') as Array<number> || [];
    this.numeroappel2 = this.saf.getFiltre('facture', 'number', 'LE') as Array<number> || [];
    this.destination = this.saf.getFiltre('facture', 'destination', 'includes') as Array<string> || [];
    this.processedClient$.next(this.saf.filtrer('facture', this.tabFacture));
    this.processedClient$.subscribe((d) => {
      this.dataSource.data = d;
    })
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

  ngAfterViewInit(): void {
    this.toggleAllRows()
  }
   // Méthode pour extraire le deuxième mot de la variable "client.numero_facture"
   extractSecondWord(numeroFacture: string): string {
    const words = numeroFacture.split('-');
    if (words.length >= 2) {
      return words[1];
    }
    return ''; // Retourner une chaîne vide ou une valeur par défaut si la chaîne n'a pas au moins 2 mots.
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

}/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}


/** Selects all rows if they are not all selected; otherwise clear selection. */
toggleAllRows() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.dataSource.data);
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: any): string {
  if (!row) {

    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}

downlaodCsv(){
  //get(this.selection._selected)
  const csvContent = this.convertArrayToCSV(this.selection.selected,this.customHeaders);
  const blob = new Blob([csvContent], { type: 'text/csv' });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'liste_facture.csv';
  link.click();

  window.URL.revokeObjectURL(url);
}

convertArrayToCSV(data: any[][], customHeaders: string[]) {
  const keys = Object.keys(data[0]);
  const csvRows = [];

  // Create the header row

  const headerRow = customHeaders.map(header => `"${String(header).replace(/"/g, '""')}"`);
  csvRows.push(headerRow.join(';'));

  // Create the data rows
  for (const obj of data) {
    const dataRow = keys.map(key => {
      // Escape double quotes and wrap each value in double quotes to handle special characters properly
      return `"${String(obj[key]).replace(/"/g, '""')}"`;
    });

    csvRows.push(dataRow.join(';'));
  }

  return csvRows.join('\n');
}
logos(){

}

}
