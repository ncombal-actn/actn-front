import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutilsRoutingModule } from './outils-routing.module';
import { TestEliComponent } from './test-eli/test-eli.component';
import { TestARCEPComponent } from './test-arcep/test-arcep.component';
import { UtilModule } from '@/_util/util.module';


@NgModule({
  declarations: [
    TestEliComponent,
    TestARCEPComponent
  ],
  imports: [
    CommonModule,
    OutilsRoutingModule,
    UtilModule
    
  ]
})
export class OutilsModule { }
