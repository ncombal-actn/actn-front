import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlywanComponent } from './onlywan.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthGuard } from '@core/_guards';
import { ContactComponent } from './contact/contact.component';



const routes: Routes = [
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
        path: 'outils', loadChildren: () => import('./outils/outils.module').then(m => m.OutilsModule)
      },
      {
        path: 'nosOffres', loadChildren: () => import('./nos-offres/nos-offres.module').then(m => m.NosOffresModule)
      },
      {
        canActivate: [AuthGuard],
        path: 'mesClients', loadChildren: () => import('./mes-clients/mes-clients.module').then(m => m.MesClientsModule)
        
      },
      {
        canActivate: [AuthGuard],
        path: 'maConsommation', loadChildren: () => import('./ma-consomation/ma-consomation.module').then(m => m.MaConsomationModule)
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
  
]


;


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule
  ]
})
export class OnlywanRoutingModule { }
