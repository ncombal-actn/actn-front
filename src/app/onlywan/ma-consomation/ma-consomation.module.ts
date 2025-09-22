import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdrComponent } from './cdr/cdr.component';
import { FactureComponent } from './facture/facture.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { UtilModule } from '@/_util/util.module';
import { MaConsomationRoutingModule } from './ma-consomation-routing.module';

@NgModule({
  declarations: [
    CdrComponent,
    FactureComponent
  ],
  imports: [
    CommonModule,
    UtilModule,
    MaConsomationRoutingModule,
    MatSortModule,
    MatInputModule,
    MatTableModule,
  ]
})
export class MaConsomationModule { }
