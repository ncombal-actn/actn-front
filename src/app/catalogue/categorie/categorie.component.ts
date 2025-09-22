import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthenticationService, CatalogueService } from '@/_core/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentsInteractionService } from '@/_core/_services/components-interaction.service';
import { Observable } from 'rxjs';
import { Tree, Categorie } from '@/_util/models';
import { ProduitService } from '@core/_services/produit.service';
import { environment } from '@env';
import { take } from 'rxjs/operators';
import { faCalendarAlt, faCogs } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategorieComponent implements OnInit {

  constructor(
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    private catalogueService: CatalogueService,
    public produitService: ProduitService,
    public componentsInteractionService: ComponentsInteractionService,
    private router: Router
  ) { }

  environment = environment;
  chemin = null;
  niveau = null;
  structureCatalogue: Observable<Tree<Categorie>>;

  ngOnInit() {
    this.chemin = this.route.snapshot.data.filDArianne;

    this.niveau = this.chemin.length;
    if (this.niveau !== 1 && this.chemin[1].url === '?search') {
      this.niveau = 1;
    }
    this.structureCatalogue = this.catalogueService.getStructure();
   
    
    if (this.niveau === 3) {
      this.structureCatalogue.pipe(take(1)).subscribe((structure) => {
        const cat = structure.nodes?.find(categorie => categorie.value.label === this.chemin[1].label);
        if (cat) {
          const subCat = cat.nodes?.find(subCategorie => subCategorie.value.label === this.chemin[2].label);
          if (subCat && (subCat.nodes == null || subCat.nodes.length === 0 || subCat.nodes)) {
            this.router.navigate(['/catalogue', cat.value.label, subCat.value.label]); // avant on ajouter unique pour skip l'étape des sous catégories à rajouter ici si il change d'avis 
          }
        }
      });
    }
  }

  protected readonly faCogs = faCogs;
  protected readonly faCalendarAlt = faCalendarAlt;
}
