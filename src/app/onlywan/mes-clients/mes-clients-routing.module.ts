import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { NewClientComponent } from './new-client/new-client.component';
import { DetailClientComponent } from './detail-client/detail-client.component';


const routes: Routes = [
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


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MesClientsRoutingModule { }
