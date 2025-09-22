import { NgModule } from '@angular/core';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { ClipboardModule } from '@angular/cdk/clipboard'

import { CatalogueComponent } from './catalogue.component';
import { UtilModule } from '@/_util/util.module';
import { ProduitComponent } from './produit/produit.component';

import {MatTabsModule} from '@angular/material/tabs';
import { NosMarquesComponent } from './nos-marques/nos-marques.component';
import { MetiersComponent } from './metiers/metiers.component';
import {MatIconModule} from "@angular/material/icon";
import { NgOptimizedImage} from "@angular/common";
import { RedZoomModule } from 'ngx-red-zoom';
//import {AppModule} from "@/app.module";
import { SavPopupComponent } from './sav-popup/sav-popup.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@NgModule({
  declarations: [
    CatalogueComponent,
    ProduitComponent,
    NosMarquesComponent,
    MetiersComponent,
    SavPopupComponent
  ],
    imports: [
        UtilModule,
        MatTabsModule,
        CatalogueRoutingModule, // import routing
        ClipboardModule,
        MatIconModule,
        UtilModule,
        NgOptimizedImage,
        RedZoomModule,
      //  AppModule,
        NgxSkeletonLoaderModule
    ]
})
export class CatalogueModule { }
