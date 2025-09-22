import { NgModule } from '@angular/core';
import { PanierRoutingModule } from './panier-routing.module';
import { PanierComponent } from './panier.component';
import { PanierRowComponent } from './panier-row/panier-row.component';
import { ValidationPanierComponent } from './validation-panier/validation-panier.component';
import { ConfirmationPanierComponent } from './confirmation-panier/confirmation-panier.component';
//import { SharedModule } from '../shared/shared.module';
import { UtilModule } from '@/_util/util.module';
import { LabelsPanierComponent } from './labels-panier/labels-panier.component';
import { StepperComponent } from './stepper/stepper.component';
import { ConfigurateursModule } from '@/configurateurs/configurateurs.module';


@NgModule({
  declarations: [
    PanierComponent,
    ValidationPanierComponent,
    ConfirmationPanierComponent,
    PanierRowComponent,
    LabelsPanierComponent,
    StepperComponent,
  ],
  imports: [
    PanierRoutingModule,
    UtilModule,
   // SharedModule,
  ],
  exports: [
    ValidationPanierComponent,
    LabelsPanierComponent,
    PanierRowComponent
  ]
})
export class PanierModule { }
