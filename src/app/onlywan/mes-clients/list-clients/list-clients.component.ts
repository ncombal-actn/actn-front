import { OnlywanClient } from '@/onlywan/onlywan.service';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from '@core/_services';
import { environment } from '@env';
import {Router, RouterLink} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {TooltipComponent} from "@/_util/components/tooltip/tooltip.component";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-list-clients',
  standalone: true,
  imports: [
    TitleWLineComponent,
    RouterLink,
    MatTable,
    MatSort,
    MatFormField,
    MatLabel,
    MatPaginator,
    TooltipComponent,
    MatInput
  ],
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent implements OnInit , AfterViewInit {

  explicationPDFindispo = "Le fichier PDF associé à ce devis est momentanément indisponible."
  displayedColumns: string[] = ['clientreference', 'clientadresse', 'dossier', 'devis',
  'clienttel'];
  dataSource = new MatTableDataSource<OnlywanClient>() ;
  processedClient$ = new BehaviorSubject<Array<OnlywanClient>>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  hasErreur = false;
  erreurMessage = '';

  constructor(private http: HttpClient, private authService: AuthenticationService, private router: Router,) { }
  clients: OnlywanClient[];
  ngOnInit(): void {

  }
  ngAfterViewInit(){


      this.getClient();



  }
  getClient() {
    this.http.get<any[]>(`${environment.apiUrl}clientOnlywanMaj.php`, {
      withCredentials: true,
      responseType: 'json',
      params:{
        mode: 'SEL',
       // client: ref
      }
    }).subscribe(
      data => {
if (data.length > 0 && 'erreur' in data[0]) {
        this.hasErreur = true;
        this.erreurMessage = data[0].erreur;
        // Arrête le traitement ici
        return;
      } else {
        this.hasErreur = false;
        this.erreurMessage = '';
      }

this.processedClient$.next(data)
this.processedClient$.subscribe((d)=>{



  this.dataSource.data = d;
  this.initializeDefaultSort();
  this.dataSource.sort = this.sort;

})
this.dataSource.paginator = this.paginator
          //this.clients
      }
    )
  }
/*   ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  } */

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  initializeDefaultSort() {
    if (this.dataSource.data && this.dataSource.data.length > 0) {
      this.sort.sort({
        id: 'clientreference', // Remplacez 'clientreference' par la colonne par laquelle vous souhaitez trier par défaut
        start: 'asc', // Remplacez 'asc' par 'desc' si vous souhaitez un tri descendant par défaut
        disableClear: true
      });
    }
  }

  openInNewWindow(client){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/espace-client/devis'])
    );
    window.open(decodeURIComponent(url), '_blank');
  }


}

