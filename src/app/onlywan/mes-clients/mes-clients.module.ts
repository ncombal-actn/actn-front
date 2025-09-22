import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { NewClientComponent } from './new-client/new-client.component';
import { UtilModule } from '@/_util/util.module';
import { MesClientsRoutingModule } from './mes-clients-routing.module';
import { MatSortModule } from '@angular/material/sort';
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import { DetailClientComponent } from './detail-client/detail-client.component';



@NgModule({
  declarations: [
    ListClientsComponent,
    NewClientComponent,
    DetailClientComponent
  ],
  imports: [
    CommonModule,
    UtilModule,
    MesClientsRoutingModule,
    MatSortModule,
    MatInputModule,
    MatTableModule,
  ]
})
export class MesClientsModule { }
