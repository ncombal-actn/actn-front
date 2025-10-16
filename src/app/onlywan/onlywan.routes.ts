import { Routes } from '@angular/router';
import { OnlywanComponent } from './onlywan.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthGuard } from '@core/_guards';
import { ContactComponent } from './contact/contact.component';


export const ONLYWAN_ROUTES: Routes = [
  {
    path: '',
   // redirectTo: '/accueil', pathMatch: 'full',
    component: OnlywanComponent,
    data: {
      filDArianne: [{ url: 'onlywan', label: 'Onlywan' }]
    },
    //canActivate: [AuthGuard],
    children: [
      {
        path: 'accueil',
        component: AccueilComponent,
        data: {
          filDArianne: [{ url: 'accueil', label: 'accueil' }]
        },

      },
      {
        path: 'outils', loadChildren: () => import('./outils/outils.routes').then(m => m.OUTILS_ROUTES)
      },
      {
        path: 'nosOffres', loadChildren: () => import('./nos-offres/nos-offres.routes').then(m => m.NOS_OFFRES_ROUTES)
      },
      {
        canActivate: [AuthGuard],
        path: 'mesClients', loadChildren: () => import('./mes-clients/mes-clients.routes').then(m => m.MES_CLIENTS_ROUTES)
      },
      {
        canActivate: [AuthGuard],
        path: 'maConsommation', loadChildren: () => import('./ma-consomation/ma-consomation.routes').then(m => m.MA_CONSOMMATION_ROUTES)
      },
      {
        path: 'contacts',
        component: ContactComponent,
        data: {
          filDArianne: [{ url: 'contact', label: 'contact' }]
        }

      },
      {
        path: '**', component: AccueilComponent,
        data: {
          filDArianne: [{ url: '404', label: 'Accueil', guarded: true }],
        },
      }
    ]
  }
];
