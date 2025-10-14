import { Component, OnInit, OnDestroy, ViewChildren, AfterViewInit, QueryList, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Licence, Produit, Client, CartItem, Cotation } from '@/_util/models';
import { ProduitService } from '@core/_services/produit.service';
import { take, takeUntil } from 'rxjs/operators';
import { UserService, LicenceService, TempCartService, CartService, CotationService } from '@core/_services';
import { TransportService } from '@core/_services/transport.service';
import { ValidationPanierComponent } from '@/panier/validation-panier/validation-panier.component';
import { Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-contrat-modification',
    templateUrl: './contrat-modification.component.html',
    styleUrls: ['./contrat-modification.component.scss']
})
export class ContratModificationComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChildren(ValidationPanierComponent)
    private validationPanierComponent: QueryList<ValidationPanierComponent>;

    licence: Licence;
    licenceOfFiltres: any[];
    filtresMarqueOf: any[];
    filtresMarque: any[];

    selectedDuree = '0';

    selectedPosteMul = 1;
    selectedUpgrade = 'Non';

    durees = new Set<string>();
    postes = new Set<string>();

    newLicence: Produit = null;
    newLicenceArray: Produit[] = [];
    selectedLicence: Produit = null;
    // Gestion des licences multiplicatives
    mul = false;
    max = Number.MAX_SAFE_INTEGER;

    montant = 0;
    attention = false;
    added = false;

    //MIDI MINUIT FAUT FAIRE TOURNER LE REFOUR

    licenceForm: FormGroup = new FormGroup({});
    swapCart = new Map<string, CartItem>();

    ready = false;
    lockCommande = true;

    showPopupDevis = false;

    entries = {
        type: '',
        duree: '',
        postes: ''
    };

    get type() {
        return this._type;
    }
    set type(newType) {
        this._type = newType;
        this.populateFormulaire();
        this.findLicence();
    }
    /**
   * Change la cotation active du produit
   * @param event Nouvelle cotation du produit, null si on retire la cotation
   */
  changeActiveCotation(event: Cotation): void {
    this.seletedCotation = event;
  }

   /*  get ajoutPoste(): boolean {
        return this._ajoutPoste;
    }
    set ajoutPoste(value: boolean) {
        this.selectedPosteMul = 0;
        this._ajoutPoste = value;
        this.noContinue();
        if (!value) {
            this.resetNbPoste();
            this.findLicence();
        }

    }
    */

    continue = false;
    upgradable = false;
    renew = true;
    cotationLaParent: Cotation[] | null = null;
    cotations: Cotation[] = [];

    private _type: '' | 'renew' | 'upgrade' | 'new' = '';
    private _searching: Subscription;
    ajoutPoste = signal(false);
    private _enduserSet = false;
    private _destroy$ = new Subject<void>();
    seletedCotation: Cotation | null = null;

    constructor(
        private produitService: ProduitService,
        public route: ActivatedRoute,
        public router: Router,
        public transportService: TransportService,
        public userService: UserService,
        public licenceService: LicenceService,
        private cotationService: CotationService,
        //private tempCartService: TempCartService,
        private tempCartService: CartService,

        private fb: FormBuilder,
    ) {
        effect(() => {
            const value = this.ajoutPoste();

            this.selectedPosteMul = 0;
            this.noContinue();

            if (!value) {
              this.resetNbPoste();
              this.findLicence();
            }
          });
    }


 /*    onCotationLoaded() {
  const fullCot = this.cotationService.getCotationsFromSession();
  this.cotationLaParent = fullCot.allCotations;

  // Ici, tu es sûr que la cotation est bien définie !
} */

    ngOnInit(): void {
        this.licenceForm = this.fb.group({
            produit: [null, Validators.required],
            duree: [null,Validators.required],
            postes: [{ value: '', disabled: true } ]

        })
     //   this.onCotationLoaded();

      /*   this.licenceForm.get('produit')?.valueChanges.subscribe((produit: Produit) => {

           // this.durees = produit?.criterevalue20 ||'';
           // this.postes = produit?.postes || [];
            this.licenceForm.get('duree')?.reset(); // Réinitialiser le champ durée
            this.licenceForm.get('postes')?.reset(); // Réinitialiser le champ postes
          });
        */

        if (history.state.licence == null) {
            this.router.navigate(['../'], { relativeTo: this.route });
        } else {

            this.licence = history.state.licence;
            this.licenceOfFiltres = history.state.licenceOfFiltres;
            this.filtresMarqueOf = history.state.filtresMarqueOf;
            this.filtresMarque = history.state.filtresMarque;

            this.tempCartService.emptyCart();


            this.selectedDuree = this.licenceOfFiltres?.[this.entries.duree];


            this.produitService.getProduitsRenouvellement(this.licence.produit.reference).subscribe(data=>{

                this.newLicenceArray = data

                this.getCritereValue(this.newLicenceArray);
        })


          // on verra après  this.resetNbPoste();

          //avant
          //this.populateFormulaire();
          // this.findLicence();


            // Upgradable  on fait plus a laissez pour la suite?
            // this.upgradable = this.filtresMarqueOf.find(el => el[this.entries.type] === 'UPGRADE' && el['val02'] !== this.licenceOfFiltres['val02']) != null;
            // Nouvelle acquisition pareil on laisse ?
            // this.type = this.licenceService.isRenewable(this.licence) ? '' : 'new';


            // Notion de renew ?
            this.renew = true //this.filtresMarqueOf.find(filtreMarqueOf => filtreMarqueOf[this.entries.type] === 'RENEW') != null;


            this.userService.getProfil().subscribe(data => {


                this.transportService.setTVA(data.TauxTVA);
                this.transportService.setMail(data.TIERSMEL);
                this.transportService.chargerGrille().subscribe(data => {
                this.transportService.grilleTrans = data;
                });
            });
            this.ready = true;
        }

    }

    /**
     * Remplis ce putain de formulaire avec les valeurs de la licence à renouveler par rapport au produit selectionner.
     */
    popFormulaire(): void {

        this.postes.clear();
        this.durees.clear();
        const array = []
        array.push(this.selectedLicence)

        array
       /*
       COMPRENDRE CETTE MERDE (g pas réussi fuck it)
       .filter(filtreMarque =>
            (this.entries.type !== '' ? (!this.renew || filtreMarque[this.entries.type] === this._type.toUpperCase()) : true)
            && this.checkOtherFilters(filtreMarque)) */
            .forEach(filtreMarque => {

                if (this.entries.postes !== '') {
                    this.postes.add(filtreMarque[this.entries.postes]);
                }
                if (filtreMarque[this.entries.duree] !== '') {
                    this.durees.add(filtreMarque[this.entries.duree]);
                }
            });


    }





/* getCritereValue(array: any[]): any {

    array.forEach((obj, index) => {
      for (const [key, value] of Object.entries(obj)) {
        const valKey = 'val' + String(index).padStart(2, '0');

        switch (value) {
          case 'Nombre':
            this.entries.postes = valKey;
            break;
          case "Type d'achat":
            this.entries.type = valKey;
            break;
          case 'Duree':
            this.entries.duree =  'val10'//valKey;
            break;
        }

      }
    });

  } */


    /**
     *
     * Prend en paramètre un tableau d'object est remplis les critère du formulaire ,
     */
    getCritereValue(array: any[]): any{
        const test = array[0]

        for (const [key, value] of Object.entries(test)) {

            switch (value) {
                case 'Nombre':
                    this.entries.postes = 'criterevalue' + key.substr(key.length - 2, 2);


                    break;
                case 'Type d\'achat':
                    this.entries.type = 'criterevalue' + key.substr(key.length - 2, 2);

                    break;
                case 'Durée':
                    this.entries.duree = 'criterevalue' + key.substr(key.length - 2, 2);

                    break;
            }
        }
    }


    /**
     * Alors parfois se ne sont pas des licences qui sont misent dans les licences sa posent problème avec le champs durée
     * on le sécurise avec cette fonction.
     */
    filtreDuree(): string[] {
        return Array.from(this.durees).filter(d => !!d && d.trim() !== '');

    }


    ngAfterViewInit(): void {
        this.validationPanierComponent.changes
            .pipe(takeUntil(this._destroy$))
            .subscribe((vc: QueryList<ValidationPanierComponent>) => {
                if (!this._enduserSet && vc.first != null) {
                    setTimeout(() => {


                        //vc.first.setCartService(this.tempCartService);
                        vc.first.panierForm.value.transporteur = 'MAI';
                        this.licence.client.serie = this.licence.serie;
                        vc.first.newEnduser = Client.fromObject(this.licence.client);
                        vc.first.enduser = Client.fromObject(this.licence.client);
                        this.tempCartService.clientFinal = Client.fromObject(this.licence.client);
                        this._enduserSet = true;
                        vc.first.typesDeLivraisons();
                        vc.first.recalcul();
                        vc.first.panierForm.patchValue({ref: `RENEW ${this.licence.commande.referencecommande}`});
                        vc.first.panierForm.get('ref').setValue(`RENEW ${this.licence.commande.referencecommande}`);

                    });
                }
            });
    }

    ngOnDestroy(): void {
        this.noContinue();
        this._destroy$.next();
        this._destroy$.complete();
    }

    onDureeChange(event): void {
        this.selectedDuree = event;
        this.findLicence();
    }

    onUpgradeChange(event): void {
        this.selectedUpgrade = event;
        this.findLicence();
    }
    onProduitChange(event): void {
        this.selectedLicence = event;
        this.findLicence();
        this.getCritereValue(this.newLicenceArray);
        this.popFormulaire();
    }

    onNombrePosteChange(event: number): void {
        this.selectedPosteMul = event;
        if (!this.ajoutPoste || this.type === 'new') {
            this.findLicence();
        }
    }

    onAjoutPosteChange(){
        this.ajoutPoste.update(value => !value);
    }
    AjoutPosteChangeValue(){
        return this.ajoutPoste();

    }

    /**
     * Passage à la caisse. A NON MONSIEUR MACRON PAS çAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA PAS LE CUCUL, C'EST LHEURE DE PASSER A LA CAISSE
     */
    onContinue(): void {

        this.lockCommande = true;
        this.continue = true;
        this.tempCartService.emptyCart();

        if (this.mul === false) {
            this.tempCartService.addProduit(this.selectedLicence, this.selectedPosteMul,this.seletedCotation); //this.newLicence
        } else {
            this.tempCartService.addProduit(this.selectedLicence,1, this.seletedCotation);
        }
        this.refreshPanier();
        this.lockCommande = false;
        // je suis vraiment ravagé mais tjr moins que celui qui a fait ce code à la base
    }

    /**
     * Une modification est apportée au formulaire.
     */
    noContinue(): void {
        this.continue = false;
        this._enduserSet = false;
        this.tempCartService.emptyCart();
        if (this.swapCart.size !== 0) {
            for (const item of this.swapCart.values()) {
                this.tempCartService.addProduit(item.produit, item.qte);
            }
        }
    }

    setAjoutPoste(value: boolean) {
        this.ajoutPoste.set(value);
        this.selectedPosteMul = 0;
        this.noContinue();

        const posteCtrl = this.licenceForm.get('postes');

        if (value) {
          posteCtrl?.enable();
        } else {
          posteCtrl?.disable();
          this.resetNbPoste();
          this.findLicence();
        }
      }


      toggleAjoutPoste() {
        this.setAjoutPoste(!this.ajoutPoste());
      }




    /**
     * Initialise le nombre de poste à la valeur de la licence à renouveler.
     */
    resetNbPoste(): void {
        if (this.entries.postes !== '') {
            this.mul = this.licenceOfFiltres?.[this.entries.postes].includes('à');
            if (this.mul) {
                this.selectedPosteMul = +this.licence.quantite || 1;
            } else {
                this.selectedPosteMul = +this.licenceOfFiltres?.[this.entries.postes].match(/(\d+)/g)[0];
            }
        }

        this.selectedPosteMul = +this.licence.quantite || 1;
    }

    /**
     * Remplit le formulaire avec les valeurs de la licence à renouveler.
     */
    populateFormulaire(): void {

        this.postes.clear();
        this.durees.clear();
        this.filtresMarqueOf
        .filter(filtreMarque =>
            (this.entries.type !== '' ? (!this.renew || filtreMarque[this.entries.type] === this._type.toUpperCase()) : true)
            && this.checkOtherFilters(filtreMarque))
            .forEach(filtreMarque => {

                if (this.entries.postes !== '') {
                    this.postes.add(filtreMarque[this.entries.postes]);
                }
                if (filtreMarque[this.entries.duree] !== '') {
                    this.durees.add(filtreMarque[this.entries.duree]);
                }
            });

    }



    /**
     * Retrouve la licence correspondante aux valeurs du formulaire
     */
    public findLicence(): void {
        this.lockCommande = true;
        this.newLicence = null;
        this.mul = false;
        if (this._searching != null) {
            this._searching.unsubscribe();
        }
        this.noContinue();

        const filtreMarque = this.licence.produit


        let produitRenenouvellement;
        let referenceArray =  []
        this.produitService.getProduitsRenouvellement(filtreMarque.reference).subscribe(data=>{
        produitRenenouvellement = data
        referenceArray = produitRenenouvellement.map(produit=> produit.reference)
        this.newLicenceArray = data

})

         //const produitReference = produit.reference;

    const licence = this.filtresMarqueOf.find((filtreMarque: any[]) => {
    // Nouvelle condition pour vérifier si le tableau de références n'est pas vide
    // et si filtreMarque['produit'] est égal à l'une des valeurs du tableau
    const tableauNonVide = referenceArray.length > 0;
    //const produitReference = produit.reference;
    const produitExiste = tableauNonVide && referenceArray.includes(filtreMarque["produit"]);

            const resCheckNbPoste = this.checkNbPoste(filtreMarque);

            return (this.entries.type !== '' ? (!this.renew || filtreMarque[this.entries.type] === this.type.toUpperCase()) : true)
            && resCheckNbPoste
            && this.licenceOfFiltres['val01'] === filtreMarque['val01']
            && (this.type === 'upgrade' || this.licenceOfFiltres['val02'] === filtreMarque['val02'])
            && this.checkOtherFilters(filtreMarque)
            && filtreMarque[this.entries.duree] === this.selectedDuree
            && (tableauNonVide ? produitExiste : true);
        });


        if (licence != null) {


         //Ce if était en commentaire, mais il sert maintenant. A voir si il fait pas tout crash
          if (licence['produit'] != null) {

                if (this.entries.postes !== '') {
                    this.mul = licence[this.entries.postes].includes('à');

                    if (this.mul) {
                        this.montant = +licence['produit'].prix * this.selectedPosteMul;
                    } else {
                        this.montant = +licence['produit'].prix;
                    }
                } else {
                    this.montant = +licence['produit'].prix;
                }
                this.produitService.getProduitById(licence['produit']).pipe(take(1)).subscribe(produit => {
                    this.newLicence = produit
                })
                 //this.produitService.getProduitById(licence['produit'])  pas mieux avec getProduitsRemplacement
                ;



          }else{

          if (this.licence.statut == "Active") {
            this._searching = this.produitService.getProduitById(this.licence.produit.reference).pipe(take(1)).subscribe(produit => {


                if (this.entries.postes !== '') {
                    this.mul = licence[this.entries.postes].includes('à');
                    if (this.mul) {
                        this.montant = +produit.prix * this.selectedPosteMul;
                    } else {
                        this.montant = +produit.prix;
                    }
                } else {
                    this.montant = +produit.prix;
                }


                this.newLicence = produit;
            });
          }else{
            this._searching = this.produitService.getProduitById(licence['produit']).pipe(take(1)).subscribe(produit => {

                if (this.entries.postes !== '') {
                    this.mul = licence[this.entries.postes].includes('à');
                    if (this.mul) {
                        this.montant = +produit.prix * this.selectedPosteMul;
                    } else {
                        this.montant = +produit.prix;
                    }
                } else {
                    this.montant = +produit.prix;
                }

                this.newLicence = produit;
            });
          }
        }

        }
    }



    /**
     * Vérifie qu'une licence match tous les critères de la licence à renouveler.
     * @param filtreMarque La licence à vérifier
     */
    private checkOtherFilters(filtreMarque: any[]): boolean {
        for (const [key, value] of Object.entries(filtreMarque)) {
            if (key.startsWith('criterevalue')) {
                if (key !== this.entries.duree && key !== this.entries.postes && key !== this.entries.type && key !== 'val02') {
                    if (value !== this.licenceOfFiltres[key]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Indique si le nombre de postes sélectionné correspondant à une licence.
     * @param filtreMarque La licence à vérifier
     */
    private checkNbPoste(filtreMarque: any[]): boolean {
        // Vérifie si la licence a une notion de poste
        if (this.entries.postes !== '') {
            // Le nombre de poste renseigné contient des lettres
            if (filtreMarque[this.entries.postes].match(/\D/g)) {
                // Le nombre de poste renseigné est de la forme x à x
                if (filtreMarque[this.entries.postes].includes('à')) {
                    const reg = new RegExp(/^(\d+) à (\d+).*$/);
                    const res = reg.exec(filtreMarque[this.entries.postes]);
                    if (res != null) {
                        return this.selectedPosteMul >= +res[1] && this.selectedPosteMul <= +res[2];
                    } else {
                        return false;
                    }
                } else {
                    // Le nombre de poste renseigné est sous une autre forme. Ex: Pack de 2
                    const reg = new RegExp(/(\d+)/g);
                    const res = reg.exec(filtreMarque[this.entries.postes]);
                    if (res != null) {
                        return this.selectedPosteMul === +res[1];
                    } else {
                        return false;
                    }
                }
            } else {
                // Le nombre de poste renseigné ne contient que des chiffres
                return this.selectedPosteMul == +filtreMarque[this.entries.postes];
            }
        } else {
            return true;
        }
    }

    /**
     * Rafraichit le panier.
     */
    refreshPanier(): void {
        this.lockCommande = true;
        this.validationPanierComponent?.first?.recalcul();
        this.lockCommande = false;
    }

    /**
     * Retourne à la vue des licences.
     */
    backToLicences(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    /**
     * Envoi une demande de devis.
     */
    demandeDevis(): void {
        this.licenceService.demandeDevis(this.licence, this.selectedPosteMul, this.selectedDuree)
            .pipe(take(1))
            .subscribe(() => {
                this.showPopupDevis = true;
            });
    }

}
