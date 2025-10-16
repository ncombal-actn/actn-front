import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  ActivatedRouteSnapshot, RouterLink
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { FilDArianneItem } from '@/_util/models';
import { AuthenticationService, CatalogueService, TitleService } from '@/_core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { ComponentsInteractionService } from '@/_core/_services/components-interaction.service';
import { environment } from 'environments/environment';
import {faChevronRight, faHome} from "@fortawesome/free-solid-svg-icons";
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/**
 * Composant représentant le fil d'arianne.
 */
@Component({
  selector: 'app-fil-d-arianne',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLink
  ],
  templateUrl: './fil-d-arianne.component.html',
  styleUrls: ['./fil-d-arianne.component.scss']
})
export class FilDArianneComponent implements OnInit
{
  /**
   * Contient le fil d'arianne courant.
   */
  public filDArianne: FilDArianneItem[];
  environment = environment;
  showList = false;
  listCatDyn = [];
  chemin: string[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    public catalogueService: CatalogueService,
    public produitService: ProduitService,
    public componentsInteractionService: ComponentsInteractionService,
    private title: TitleService
  ) { }

  ngOnInit()
  {
    this.catalogueService.generateStructure();
    // Déclenche la mise à jour du fil d'arianne à chaque instance d'une évènement NavigationEnd (changement d'URL terminé).

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.title.resetTitle(); // reset le titre sur un titre par defaut
        this.filDArianne = this.getFil(this.route.snapshot); // this.route.snapshot = instantané de l'état actuel de la route.

        let newSearch: string = this.route.snapshot.queryParams?.['search'];
        if (!!newSearch)
        {
          this.filDArianne[this.filDArianne.length - 1].label = "Recherche \""+newSearch+"\"";
        }
      });

  }

  /**
   * Méthode récursive construisant le fil d'arianne
   * @param route La section de la route (URL) étudiée.
   * @param url L'URL représentant la concaténation des sections précédentes.
   * Permet d'associer son URL complet à chaque partie du fil d'arianne.
   * @param filDArianne Tableau contenant les différentes parties du fil d'arianne.
   */
  private getFil(
    route: ActivatedRouteSnapshot,
    url: string = '',
    filDArianne: FilDArianneItem[] = []
  ): FilDArianneItem[]
  {
    // Le nom de la propriété dans les modules de routing contenant les données de fil d'arianne
    const ROUTE_DATA_FIL = 'filDArianne';

    // get the child routes

    const children: ActivatedRouteSnapshot[] = route.children;

    // return if there are no more children
    if (children.length === 0) {
      return filDArianne;
    }
    // iterate over each children
    for (const child of children) {
      // verify primary route
      // if (child.outlet !== PRIMARY_OUTLET || child.url.length === 0) {
      // continue;
      // }
      // verify the custom data property "filDArianne" is specified on the route

      if (!child.data.hasOwnProperty(ROUTE_DATA_FIL)) {
        // recursif
        return this.getFil(child, url, filDArianne);
      }
      for (const fil of child.data[ROUTE_DATA_FIL]) {
        let append = true;
        if (!!fil.url) {

          // Si cette section de l'URL représente un paramètre de route (exemple : les différentes niveaux dans le catalogue).
          if (fil.url.startsWith(':')) {
            fil.label = decodeURIComponent(child.paramMap.get(fil.url.slice(1)));
            // append route URL to URL
            url += `/${fil.label}`;
            // Si cette section de l'URL représente un paramètre de requête
            // (exemple : une chaine de caractère pour la recherche par mot clé, l'ID d'une marque, ...).
          } else if (fil.url.startsWith('?')) {
            const queryParam = child.queryParamMap.get(fil.url.slice(1));
            if (!queryParam) {
              append = false;
            } else {
              fil.label = fil.label.replace('?', queryParam);
            }
            url = null;
            // Si cette section de l'URL représente une route classique.
          } else {
            // append route URL to URL
            url += `/${fil.url}`;
          }
        }
        if (append) {
          this.title.addTitle(fil.label);
          filDArianne.push({
            label: fil.label,
            url: fil.guarded ? null : url
          });
        }
      }

      // recursive
      return this.getFil(child, url, filDArianne);
    }
    return filDArianne;
  }

  // Remplissage de la liste des Categories a afficher en hover du fil d'arianne

  enterItem(url) {
    if (url != null) {
      this.showList = true;
      this.chemin = url.slice(1).split('/');
      const niveau = this.chemin.length;
      this.listCatDyn = [];
      if (niveau === 1 && this.chemin[0] === 'catalogue') {
        this.listCatDyn = [];
        this.catalogueService.listCat.forEach((value, key: string[]) => {
          this.listCatDyn.push(key);
        });
      }
      if (niveau === 2) {
        this.listCatDyn = [];
        this.catalogueService.listCat.forEach((value, key: string[]) => {
          if (key[1] === this.chemin[1]) {
            value.forEach((value, key: string) => {
              this.listCatDyn.push(key);
            });
          }
        });
      }
      if (niveau === 3) {
        this.listCatDyn = [];
        this.catalogueService.listCat.forEach((value, key: string[]) => {
          if (key[1] === this.chemin[1]) {
            value.forEach((value, key) => {
              if (key[1] === this.chemin[2]) {
                value.forEach((value, key: string) => {
                  this.listCatDyn.push(key);
                });
              }
            });
          }
        });
      }
    }
  }

  unique(url) {
    const chemin = url.slice(1).split('/');
    const niveau = chemin.length;
    if (this.catalogueService.listCat.get(chemin[1]) != null && niveau === 3) {
      return this.catalogueService.listCat.get(chemin[1]).get(chemin[2]).length === 0;
    } else {
      return false;
    }
  }

  protected readonly faHome = faHome;
  protected readonly faChevronRight = faChevronRight;
}
