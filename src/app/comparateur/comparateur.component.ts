import { Component, OnInit } from "@angular/core";
import {  Produit } from "@/_util/models";
// RXJS
import { Subscription } from "rxjs";
import { take } from "rxjs";
// SERVICES
import { ComparateurService } from "@/_core/_services/comparateur.service";
import { ProduitService } from "@core/_services/produit.service";

// TO DELETE LATER ?
/////////////////////////////////
import { AuthenticationService, WindowService } from "@core/_services";
import { environment } from "@env";
import {SlidingListeComponent} from "@/_util/components/sliding-liste/sliding-liste.component";
/////////////////////////////////

@Component({
  selector: "app-comparateur",
  standalone: true,
  imports: [
    SlidingListeComponent
  ],
  templateUrl: "./comparateur.component.html",
  styleUrls: ["./comparateur.component.scss"],
})
export class ComparateurComponent implements OnInit {
  environment = environment;

  // Attributs
  /////////////////////////////////////////////////////////////////////////////////

  /** Liste des Produits comparés */
  produitsCompare: Produit[] = [];

  /** Liste multi onglet des references des produits comparés */
  referencesOfProduitsCompare: string[] = null;
  /** Subscription au 'ComparateurService' */
  compareSubscription: Subscription = null;
  /** Is the compare localStorage not empty ? */
  notEmpty = true;

  /////////////////////////////////////////////////////////////////////////////////

  // slider: Element = document.querySelector('.compareList');
  // isDown: boolean = false;
  // startX;
  // scrollLeft;

  constructor(
    private produitService: ProduitService,
    private comparateurService: ComparateurService,
    private window: WindowService,
    public authService: AuthenticationService,
  ) {

  }

  /**
   * Initialisation de ComparateurComponent
   * - Récupère la liste de références des produits comparés
   * - Récupère la liste des Produits à partir des références
   * - S'abonne au ComparateurService pour mettre à jours les liste
   */
   ngOnInit() {

    // setup and get 'referencesOfProduitsCompare'
    this.referencesOfProduitsCompare = this.comparateurService.setUp();

    // is 'referencesOfProduitsCompare' empty ?
    this.notEmpty = this.referencesOfProduitsCompare[0] != "";

    // get product for each 'referencesOfProduitsCompare' and push them in 'produitsCompare'

      for (let i = this.referencesOfProduitsCompare.length - 1; i >= 0; i--) {
        this.addProduitObjFromReference(this.referencesOfProduitsCompare[i]);
      }


    this.compareSubscription = this.comparateurService.compare().subscribe(
      (ret) => {

        this.referencesOfProduitsCompare = ret;
        // mets à jour la list de Produits 'produitsCompare' s'il y a eu du changement dans la liste des références 'referencesOfProduitsCompare'
        this.updateProduitsCompareFromReferencesOfProduitsCompare();

        this.notEmpty = this.referencesOfProduitsCompare.length != 0;
      }
    );
  }

  /** Destruction de ComparateurComponent */
  ngOnDestroy() {
    if (this.compareSubscription != null) {
      this.compareSubscription.unsubscribe();
    }
  }


  /**
   * Ajoute un objet Produit à la liste des produits comparés à sa position dans l'ordre des prix croissant
   */
  addToProduitsCompareByPrice(produit: Produit): void {
    let lenth = 0;
    for (let i = 0; i < this.produitsCompare.length; i++) {
      lenth += 1;
      if (this.produitsCompare[i].prix >= produit.prix) {
        this.produitsCompare.splice(i, 0, produit);
        break;
      }
    }
    if (lenth >= this.produitsCompare.length) {
      this.produitsCompare.push(produit);
    }
    this.produitsCompare = this.produitsCompare.concat([]);
  }

  /**
   * Récupère les informations d'un produit depuis sa référence avant de l'ajouter à la liste des produits comparés
   * @param reference Référence du produit à ajouter aux produits comparés
   */
  addProduitObjFromReference(reference: string): void {
    this.produitService
      .getProduitById(reference)
      .pipe(take(1))
      .subscribe(
        (ret) => {
          if (ret.reference !== "") {
            // this.produitsCompare.push(ret);
            // this.produitsCompare = this.produitsCompare.concat([ret]);

          this.addToProduitsCompareByPrice(ret);
          } else {
            this.comparateurService.removeFromCompare(reference);
          }
        },
        (error) => {
          console.error(
            "Erreur dans 'comparateurComponent': 'ProduitByID.php' à échoué :",
            error
          );
        }
      );
  }

  updateProduitsCompareFromReferencesOfProduitsCompare() {
    let alreadyHaveTheReferencesProduct = false;

    // retirer les produits qui ne sont plus comparés
    for (let i = this.produitsCompare.length - 1; i >= 0; i--) {
      if (
        !this.referencesOfProduitsCompare.includes(
          this.produitsCompare[i].reference
        )
      ) {
        this.produitsCompare.splice(i, 1);
        this.produitsCompare = this.produitsCompare.concat([]);
      }
    }
    // ajouter les produits ajoutés au comparateur
    for (let j = this.referencesOfProduitsCompare.length - 1; j >= 0; j--) {
      // parse produits pour chaque reference de la nouvelle liste de ref
      alreadyHaveTheReferencesProduct = false;
      for (let k = this.produitsCompare.length - 1; k >= 0; k--) {
        if (
          this.referencesOfProduitsCompare[j] ==
          this.produitsCompare[k].reference
        ) {
          alreadyHaveTheReferencesProduct = true;
          break;
        }
      }

      if (!alreadyHaveTheReferencesProduct) {
        this.addProduitObjFromReference(this.referencesOfProduitsCompare[j]);
      }
    }
  }

  // EXCEL EXPORT
  /////////////////////////////////////////////////////////////////////////////////

  /**
   * Exécute un PHP qui va exporter la liste des produits comparés en xls et proposer à l'utilisateur de la télécharger
   */
  excport() {
    // let stringifiedProduits: string = JSON.stringify(this.produitsCompare);
    const fileName = "ACTN_Comparateur_export";
    this.window.open(
      `${environment.apiUrl}exportProduitsToXlsFile.php?filename=` +
        fileName +
        "&refs=" +
        JSON.stringify(
          Object.values(this.produitsCompare).map(
            (prod: Produit) => prod.reference
          )
        )
    );
  }

  // COMPARATEUR SERVICE
  // Appelle le service de comparateur pour ajouter, retirer, mettre à jour ou vider les produits
  /////////////////////////////////////////////////////////////////////////////////
  /** Ajoute un produit au comparateur */
  addF(str: string): void {
    this.comparateurService.addToCompare(str);
  }
  /** Retire un produit du comparateur */
  removeF(str: string): void {
    this.comparateurService.removeFromCompare(str);
  }
  /** Mets à jour la liste du comparateur */
  updateF(): void {
    this.comparateurService.updateCompare();
  }
  /** Efface tous les produits du comparateur */
  clearF(): void {
    this.comparateurService.clearCompare();
  }
  /*toggleThisProductInFavorisService(): void
  {
	 this.comparateurService.toggleCompare(this.produitReference);
  }*/
  /////////////////////////////////////////////////////////////////////////////////
}
