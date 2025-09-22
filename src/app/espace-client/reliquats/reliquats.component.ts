import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { take } from "rxjs/operators";
import { ProduitService } from "@core/_services/produit.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env";
import { faEnvelope, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-reliquats",
  templateUrl: "./reliquats.component.html",
  styleUrls: ["./reliquats.component.scss"],
})
export class ReliquatsComponent implements OnInit {
  environment = environment;

  reliquat$ =  new BehaviorSubject<any[][]>([]);
  filteredReliquat$ = new BehaviorSubject<any[][]>([]);

  display:any[] = [];

  loading: boolean = true;

  // liste des demande de delai déjà envoyés, empèche le l'envois multiple
  sentDelay: number[] = [];
  // index de la demande de delai en erreur, permet l'affichage d'un message d'erreur
  delayInError: number = -1;

  // FORMULAIRE DE RELIQUAT
  filterForm :FormGroup = new FormGroup({});
  
  marqueArray: Array<string> = [];

  constructor(
    private http: HttpClient,
    private produitService: ProduitService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loading = true;
    this.filterForm = this.fb.group({
      commande: [''],
      refCommande: [''],
      marque: [[]],
      prod: ['']
    })
    //RECUPERATION DES RELIQUATS
    setTimeout(() => {
      this.requestReliquats()
       
      
    }, 100);

    this.filterForm.valueChanges.subscribe((val) => {

      const upperCaseValues = this.transformToUpperCase(val);
      console.log(val);
      
      this.filterReliquat(upperCaseValues);
    })
  }

  transformToUpperCase(values: any): any {
    const upperCaseValues = {};
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        if (Array.isArray(values[key])) {
          upperCaseValues[key] = values[key].map((val: string) => val.toUpperCase());
        } else {
          upperCaseValues[key] = values[key].toUpperCase();
        }
      }
    }
    return upperCaseValues;
  }

  filterReliquat(values: any): void {
    const filtered = this.reliquat$.value.map(subArray => {
      return subArray.filter(item => {
        return (!values.commande || item.numcommande.toUpperCase().includes(values.commande)) &&
               (!values.refCommande || item.referencecommande.toUpperCase().includes(values.refCommande)) &&
               (!values.marque.length || values.marque.includes(item.marque.toUpperCase())) &&
               (!values.prod || item.prod.toUpperCase().includes(values.prod));
      });
    }).filter(subArray => subArray.length > 0);
    this.filteredReliquat$.next(filtered);
  }

  clearFilter(controlName: string): void {
    const control = this.filterForm.get(controlName);
    if (control) {
      control.setValue(controlName === 'marque' ? [] : ''); // Clear array for marque, empty string for others
    }
  }
  clearAllFilters(): void {
    this.filterForm.reset({
      commande: '',
      refCommande: '',
      marque: [],
      prod: ''
    });
  }
  requestReliquats(){
    this.http
      .get<any>(`${environment.apiUrl}/CommandesReliquat.php`, {
        withCredentials: true,
        responseType: "json",
      })
      .subscribe((ret) => {
        //this.reliquat$.next(ret);

        

        // CALLBACK (setdisplay)
        this.formatReliquats(ret);
      });
  };
  formatReliquats(reliquats: any[]) {
    let i = 0;
    const sortedReliquats:any[] = [];
   
      if (reliquats !== null) {
        while (reliquats.length > 0) {
          // reset buffer
          let buffer:any[] = [];	
          // fill buffer with first element from cmd
          buffer.push(reliquats.splice(0, 1)[0]);
          // console.log(buffer);

          // search for other elements of the same command and push then in the buffer
          i = 0;
          while (i < reliquats.length) {
            // console.log(this.cmd[i].numcommande, buffer[0].numcommande);
            while (
              i < reliquats.length &&
              reliquats[i].numcommande == buffer[0].numcommande
            ) {
              // console.log("num : " + this.reliquats[i].numcommande + " corresponding");
              buffer.push(reliquats.splice(i, 1)[0]);
            }

            i++;
          }
          sortedReliquats.push(buffer);
        }
      }
      //console.log("Relicats triés : ", sortedReliquats);
     // this.reliquats = sortedReliquats;
	  this.reliquat$.next(sortedReliquats);
    this.filteredReliquat$.next(sortedReliquats);

   this.updateMarqueArray(sortedReliquats);
	  
      this.setDisplay(sortedReliquats);
      this.loadingOver();
    
  }
  setDisplay(ret:any[] ) {
    let i = 0;
		const len = ret.length;
		while (i < len) {
			this.display.push(false);
			i++;
		  }
	}
  updateMarqueArray(sortedReliquats: any[][]): void {
    const marques = sortedReliquats
      .flat()
      .map(item => item.marque)
      .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
    this.marqueArray = marques;
  }

  filtreMarqueToggle(marque: string): void {
    const control = this.filterForm.get('marque');
    if (control) {
      const currentMarques = control.value as string[];
      if (currentMarques.includes(marque)) {
        control.setValue(currentMarques.filter(m => m !== marque));
      } else {
        control.setValue([...currentMarques, marque]);
      }
    }
  }



  loadingOver() {
    this.loading = false;
   
  }

  unrollDetails(entete) {
    /* IF hidden */
    this.display[entete] = this.display[entete] == false;
  }

  /**
   * Revois le lien de la fiche du produit à partir de sa/son seul(e) reference/ID :string
   */
  linkToProduct(produitId: string) {
    // console.log("link", produit.produit);
    this.produitService
      .getProduitById(produitId)
      .pipe(take(1))
      .subscribe((ret) => {
        this.router.navigateByUrl(
          String(this.produitService.lienProduit(ret)).replace(/,/g, "/")
        );
      });
  }

  envoiDemandeDeDelai(
    ncmd: number,
    refcmd: string,
    date: string,
    index: number
  ): void {
    if (!this.sentDelay.includes(index)) {
      this.sentDelay.push(index);
      this.delayInError = -1;
      this.http
        .get<any>(`${environment.apiUrl}/envoiMailDelai.php`, {
          params: {
            numcommande: ncmd.toString(),
            referencecommande: refcmd,
            datecommande: date,
          },
          withCredentials: true,
          responseType: "json",
        })
        .pipe(take(1))
        .subscribe(
          (ret) => {
          },
          (erreur) => {
            this.sentDelay.splice(this.sentDelay.indexOf(index), 1);
            this.delayInError = index;
          }
        );
    }
  }

  protected readonly faFilePdf = faFilePdf;
  protected readonly faEnvelope = faEnvelope;
}
