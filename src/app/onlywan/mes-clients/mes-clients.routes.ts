import { Routes } from '@angular/router';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { NewClientComponent } from './new-client/new-client.component';
import { DetailClientComponent } from './detail-client/detail-client.component';


export const MES_CLIENTS_ROUTES: Routes = [
  {
    path: 'listeDeMesClients',
    component: ListClientsComponent,
    data: {
      filDArianne: [{ url: 'listeDeMesClients', label: 'liste de mes clients' , guarded: true }]
    }
  },
    {
    path: 'nouveauClient',
    component: NewClientComponent,
    data: {
      filDArianne: [{ url: 'nouveauClient', label: 'nouveau client', guarded: true  }]
    }
  },
  {
    path: 'detailClient/:id',
    component: DetailClientComponent,
    data: {
      filDArianne: [{ url: 'detailClient', label: 'detailClient :id' , guarded: true }]
    }
  }
];
