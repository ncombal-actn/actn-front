import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemeAideChoixRoutingModule } from './systeme-aide-choix-routing.module';

import { SystemeAideChoixComponent } from './systeme-aide-choix.component';
import { UtilModule } from '@/_util/util.module';


@NgModule({
  declarations: [
    SystemeAideChoixComponent
  ],
  imports: [
    UtilModule,
    CommonModule,
    SystemeAideChoixRoutingModule
  ]
})
export class SystemeAideChoixModule { }
