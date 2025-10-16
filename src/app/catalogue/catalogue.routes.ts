import {Routes} from '@angular/router';
import {CatalogueComponent} from './catalogue.component';
import {CatalogueResolverService} from '@/_core/_services/catalogue-resolver.service';
import {NouveautesResolverService} from '@/_core/_resolvers/nouveautes-resolver.service';
import {DestockageResolverService} from '@/_core/_resolvers/destockage-resolver.service';
import {PacksResolverService} from '@/_core/_resolvers/packs-resolver.service';
import {PromosResolverService} from '@/_core/_resolvers/promos-resolver.service';
import {SimilairesResolverService} from '@/_core/_resolvers/similaires-resolver.service';
import {ProduitResolverService} from './produit/produit-resolver.service';
import {ProduitComponent} from './produit/produit.component';
import {CategorieComponent} from '@/catalogue/categorie/categorie.component';
import {NosMarquesComponent} from './nos-marques/nos-marques.component';
import {MetiersComponent} from './metiers/metiers.component';
import {SpecialsResolverService} from '../_core/_resolvers/specials-resolver.service';
import {RecondionnerResolverService} from '@/_core/_resolvers/recondionner-resolver.service';
import {PromoResolverService} from "@core/_resolvers/promo-resolver.service";


export const CATALOGUE_ROUTES: Routes = [
  // default route of the module
  {
    path: '',
    pathMatch: 'full',
    component: CategorieComponent,
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue', guarded: true},
      ]
    }
  },
  {
    path: 'search',
    component: CatalogueComponent,
    resolve: {
      currentCatalogueState: CatalogueResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue'},
        {url: '?search', label: 'Recherche'},
        // { url: '?search', label: 'Recherche "?"' },
        {url: '?niv1', label: 'Métier "?"'},
        {url: '?marque', label: 'Marque "?"'}
      ]
    }
  },
  {
    path: 'fiche-produit/:ref',
    component: ProduitComponent,
    data: {
      filDArianne: [
        {url: 'fiche-produit', label: 'Fiche produit'},
        {url: ':ref', label: ''},
      ]
    }
  },
  {
    path: 'promo/:type',
    component: CatalogueComponent,
    resolve: {
      currentCatalogueState: PromoResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue', guarded: true},
        {url: 'promo', label: 'Promo', guarded: true},
      ]
    }
  },
  {
    path: 'nouveautes',
    component: CatalogueComponent,
    resolve: {
      currentCatalogueState: NouveautesResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue', guarded: true},
        {url: 'nouveautes', label: 'Nouveautés', guarded: true},
      ]
    }
  },
  {
    path: 'destockage',
    component: CatalogueComponent,
    resolve: {
      currentCatalogueState: DestockageResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue', guarded: true},
        {url: 'destockage', label: 'Destockage', guarded: true},
      ]
    }
  },
  {
    path: 'packs',
    component: CatalogueComponent,
    resolve: {
      currentCatalogueState: PacksResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue', guarded: true},
        {url: 'packs', label: 'Packs', guarded: true},
      ]
    }
  },
  {
    path: 'promotions',
    component: CatalogueComponent,
    resolve: {
      currentCatalogueState: PromosResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue'},
        {url: 'promotions', label: 'Promotions', guarded: true},
      ]
    }
  },
  {
    path: 'similaire/:id',
    component: CatalogueComponent,
    resolve: {
      currentCatalogueState: SimilairesResolverService
    },
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue'},
        {url: 'similaire', label: 'Produits similaires', guarded: true},
        {url: ':id', label: ':id', guarded: true},
      ]
    }
  },
  {
    path: 'specials',
    component: CatalogueComponent,
    resolve: {
      currentCatalogueState: SpecialsResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Spécials', guarded: true},
        {url: 'spécials', label: 'Spécials', guarded: true},
      ]
    }
  },
  {
    path: 'reconditionne',
    component: CatalogueComponent,
    resolve: {
      currentCatalogueState: RecondionnerResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue', guarded: true},
        {url: 'reconditionne', label: 'Seconde vie', guarded: true},
      ]
    }
  },
  {
    path: 'nos-marques',
    component: NosMarquesComponent,
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue'},
        {url: 'nos-marques', label: 'Nos marques', guarded: true},
      ]
    }
  },
  {
    path: 'metiers',
    component: MetiersComponent,
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue'},
        {url: 'nos-metiers', label: 'Nos Métiers', guarded: true},
      ]
    }
  },

  {
    path: ':niv1',
    component: CategorieComponent,
    resolve: {
      currentCatalogueState: CatalogueResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue'},
        {url: ':niv1', label: '', guarded: true},
      ]
    }
  },
  {
    path: ':niv1/:niv2/unique',
    component: CatalogueComponent,
    resolve: {
      currentCatalogueState: CatalogueResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue'},
        {url: ':niv1', label: ''},
        {url: ':niv2', label: '', guarded: true},
        {url: '?search', label: 'Recherche "?"'},
        {url: '?marque', label: 'Marque "?"'}
      ]
    }
  },
  {
    path: ':niv1/:niv2',
    component: CategorieComponent,
    pathMatch: 'full',
    resolve: {
      currentCatalogueState: CatalogueResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue'},
        {url: ':niv1', label: ''},
        {url: ':niv2', label: '', guarded: true},
      ]
    }
  },
  //Au cas ou la categorie n'a pas de niveau 3, lancer la recherche de produit

  {
    path: ':niv1/:niv2/:niv3',
    component: CatalogueComponent,
    resolve: {
      currentCatalogueState: CatalogueResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue'},
        {url: ':niv1', label: ''},
        {url: ':niv2', label: ''},
        {url: ':niv3', label: '', guarded: true},
        {url: '?search', label: 'Recherche "?"'},
        {url: '?marque', label: 'Marque "?"'}
      ]
    }
  },
  {
    path: ':niv1/:niv2/:niv3/:ref',
    component: ProduitComponent,
    resolve: {
      produit: ProduitResolverService
    },
    runGuardsAndResolvers: 'always',
    data: {
      filDArianne: [
        {url: 'catalogue', label: 'Catalogue'},
        {url: ':niv1', label: ''},
        {url: ':niv2', label: ''},
        {url: ':niv3', label: ''},
        {url: ':ref', label: '', guarded: true},
      ]
    }
  },
];
