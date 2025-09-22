import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SipTrunkComponent } from './sip-trunk/sip-trunk.component';
import { CartesSimComponent } from './cartes-sim/cartes-sim.component';
import { HebergementWebComponent } from './hebergement-web/hebergement-web.component';
import { CloudPbxCentrexComponent } from './cloud-pbx-centrex/cloud-pbx-centrex.component';
import { UtilModule } from '@/_util/util.module';
import { NosOffresRoutingModule } from './nos-offres-routing.module';



@NgModule({
  declarations: [
    SipTrunkComponent,
    CartesSimComponent,
    HebergementWebComponent,
    CloudPbxCentrexComponent
  ],
  imports: [
    CommonModule,
    UtilModule,
    NosOffresRoutingModule
  ]
})
export class NosOffresModule { }
