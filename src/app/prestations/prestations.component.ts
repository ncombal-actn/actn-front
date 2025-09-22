import { Produit } from '@/_util/models';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    FormGroup,
    ValidatorFn,
    ValidationErrors
} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@core/_services/authentication.service';
import { environment } from '@env';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Prestation, PrestationsService } from './prestations.service';
type Format = 'list' | 'grid';
type test = 'wrap' | 'nowrap';
/**
 * Page et formulaire de demande de prestations
 */
@Component({
    selector: 'app-prestations',
    templateUrl: './prestations.component.html',
    styleUrls: ['./prestations.component.scss']
})
export class PrestationsComponent implements OnInit, OnDestroy {

    environment = environment;
    prestationForm: FormGroup;
    prestations: Produit[];
    ready = false;
    formError = false;
    sendError = false;
    format: Format = 'list';
    wrap = false;
    showPopup = false;
    //Ce panier est unique il ne sert que pour les prestations
    panier: Produit[] =[];
    categories:any[] = []
    /**
    * Format d'affichage (liste ou vignette)
    */
    @Input() simple: boolean = false;

    // OPTIONNAL INPUT
    @Input() isFavorisList: boolean = false;

    private _destroy$ = new Subject<void>();
    private _catalogueSmall = new BehaviorSubject<boolean>(false);


    /**
    * @returns true si la largeur du conteneur du catalogue est en-dessous du breakpoint small, sinon false.
    */
    get catalogueSmall() {
        return this._catalogueSmall.value;
    }

    constructor(
        private fb: FormBuilder,
        private prestationsService: PrestationsService,
        public authService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        private breakpointObserver: BreakpointObserver,


    ) {

        this.prestationsService.prestations$.pipe(takeUntil(this._destroy$)).subscribe(prestations => {


            this.prestationForm = fb.group(
                {
                    societe: [this.authService.currentUser.name, Validators.required],
                    clientID: [this.authService.currentUser.id, Validators.required],
                    nom: [this.authService.currentUser.TIERSNOM],
                    fonction: [''],
                    email: [this.authService.currentUser.TIERSMEL, Validators.required],
                    telephone: [this.authService.currentUser.TIERSTEL],
                    /*ICI GAMIN*/
                    test: [false, Validators.required], //_prestations, // test avec this.prestations négatif je pouvais lancer la demande mais préstation été undified
                    commentaires: ['', Validators.required]
                }
            );
            this.prestationForm.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(() => this.formError = false);
            this.ready = true;
        })
    }




    ngOnInit(): void {
        /**
        * Si la largeur de l'écran passe en-dessous de 1050px, met l'état catalogueSmall à vrai, et passe en format grille / vignettes.
        */
        this.breakpointObserver
            .observe(['(max-width: 1050px)'])
            .pipe(takeUntil(this._destroy$))
            .subscribe(s => {
                this._catalogueSmall.next(s.matches);
                if (this.catalogueSmall) {
                    this.format = 'grid';
                    this.wrap = true;
                } else {
                    this.format = 'list';
                    this.wrap = false;
                }
            });

        /*on viens chercher les products*/
        this.getProduct()


    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }


    // Ajoute le produit dans le tableau si il est unique , le supprime si il existe déja
    addPrestation(elem:Produit){
      if(!this.panier.includes(elem)){
        this.panier.push(elem);
      }else{
        this.panier.splice(this.panier.indexOf(elem), 1)
      }
    }

    getProduct() {
        return this.http.get<Produit[]>(`${environment.apiUrl}//ListeProduits.php?search=&marque=&niv1=SER&niv2=PRE&niv3=`)
            .subscribe(
                data => {
                    //console.log('test',data);

                    this.prestations = data;
                    this.TableauCategory(data)

                })

    }



    atLeastOneValid(validator: ValidatorFn): ValidatorFn {
        return (group: FormGroup): ValidationErrors | null => {
            const hasAtLeastOne =
                group &&
                group.controls &&
                Object.keys(group.controls).some(k => !validator(group.controls[k]));

            return hasAtLeastOne ? null : { atLeastOne: true };
        };
    }


    /* Trier le Tableau de produit par sa catégories*/
    TrieTableau(array:Produit[]){
      return this.prestations.sort(function compare(produit1, produit2){
          if(produit1.niveaucode3 < produit2.niveaucode3){
          return -1;}
           else if (produit1.niveaucode3 > produit2.niveaucode3){
              return 1;}
              else{
                  return 0;
              }
        })
    }
    //PopUp + redirection
   hide(){
    this.showPopup =false;
    this.router.navigate(['/accueil'])
   }
   //show popup
   show(){
    this.showPopup = true
   }

    isNaN(value: number): boolean {
        return isNaN(value);
    }

    onSubmit(): void {
        this.formError = false;
        this.sendError = false;
        setTimeout(() => {
            if (this.prestationForm.valid){
                this.prestationsService.sendForm(this.prestationForm, this.panier)
                    
                    .subscribe(
                        (ret) =>
                        {
                            console.log('ret',ret);
                            
                            this.sendError = ret;
                            if (ret) {
                                this.router.navigate(['confirmation'], { relativeTo: this.route });
                            }
                        }
                    );
            } else {
              this.formError = true;
            }
        });
    }

    TableauCategory(array:Produit[]){
      let categories = this.categories;
      let  index = 0;
      let sousTableau:Produit[] = null;
      let test = null;
      //sousTableau =[]
      this.TrieTableau(array)
      //console.log('ICI',array);

      array.forEach(element => {
          index++
          if (element.niveaucode3 != test){ // Si change de catégorie dans le tableau
              //console.log('CHO',sousTableau)
              //console.log('test',sousTableau);

              sousTableau = [];
              sousTableau.push(element);
              //console.log('SOUSOUP',sousTableau);

              //Fin
              test = element.niveaucode3
              //console.log('OKKK',test);

              if (sousTableau) { // on enregistre le tableau de produits précédent


                  categories.push(sousTableau);
              }
          }else{ // on est toujours dans la même catégorie de produits dans 'array'
              //console.log(index, element);

              sousTableau.push(element);

          }

      });
      //console.log('LALAL',sousTableau);
      //console.log('CAT',categories);
      //categories = this.categories

    }


}


