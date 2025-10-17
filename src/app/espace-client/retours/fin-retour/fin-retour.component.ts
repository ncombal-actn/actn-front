import { Component, OnInit, OnDestroy } from '@angular/core';
import { RmaService } from '@core/_services/rma.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fin-retour',
  standalone: true,
  templateUrl: './fin-retour.component.html',
  styleUrls: ['./fin-retour.component.scss']
})
export class FinRetourComponent implements OnInit, OnDestroy {

  /*
    produit -> produit selectionné par l'utilisateur pour être renvoyer
    noserieList -> liste des numéros de séries séléctionnés s'il y a plusieurs produit du même type
    quantite -> quantité des produits séléctionnés s'il n'ont pas de numéro de série (sinon la quantité est à 1)
  */
  produit: any;
  noserieList: Array<string>;
  quantite: number;

  /*
    recap -> objet contenant tout les champs récapitulatif du form de confirmation retour
    pass -> chaine de caractère comprenant autant de symbole * que la longueur du mot de passe renseigné
    char -> symbole *
  */
  recap: any;
  pass: string;
  char = '*';

  constructor(
    private rmaService: RmaService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // récupération des informations du produit a retourner
    this.rmaService.clearForm();
    this.produit = this.rmaService.getProduitFin();
    this.quantite = this.rmaService.getQuantiteFin();
    this.noserieList = this.rmaService.getNoserieFin();
    if (this.quantite === 1 && this.noserieList.length > 1) {
      this.quantite = this.noserieList.length;
    }
    if (!this.produit) {
      this.retourAccueil();
    }
    this.recap = this.rmaService.getRecap();
    this.pass = this.char.repeat(this.recap.password);

  }

  ngOnDestroy(): void {
    this.rmaService.clearProduitFin();
  }

  // redirection vers l'accueil
  retourAccueil(): void {
    this.router.navigate(['/']);
  }

}
