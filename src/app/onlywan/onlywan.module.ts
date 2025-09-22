import { NgModule } from '@angular/core';
import { UtilModule } from '@/_util/util.module';
import { OnlywanComponent } from './onlywan.component';
import { OnlywanRoutingModule } from './onlywan-routing.module';
import { AccueilComponent } from './accueil/accueil.component';
import { NosOffresModule } from './nos-offres/nos-offres.module';
import { OutilsModule } from './outils/outils.module';
import { MesClientsModule } from './mes-clients/mes-clients.module';
import { ContactComponent } from './contact/contact.component';
@NgModule({
  declarations: [
    OnlywanComponent,
    AccueilComponent,
    ContactComponent,
    
  ],
  imports: [
    UtilModule,
    OnlywanRoutingModule,
    OutilsModule,
    NosOffresModule,
    MesClientsModule
  ],

})
export class OnlywanModule { }
