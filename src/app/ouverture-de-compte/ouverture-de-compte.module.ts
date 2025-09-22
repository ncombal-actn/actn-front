import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY,
  RecaptchaFormsModule,
  RecaptchaModule,
  RecaptchaSettings,
  RecaptchaV3Module
} from "ng-recaptcha";
import {MatCheckbox} from "@angular/material/checkbox";
import {OuvertureDeCompteComponent} from "./ouverture-de-compte.component";
import {UtilModule} from "../_util/util.module";
import {environment} from "@env";

@NgModule({
  declarations: [
    /*OuvertureDeCompteComponent*/
  ],
  imports: [
    CommonModule,
    RecaptchaV3Module,
    MatCheckbox,
    UtilModule
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    }
  ]
})
export class OuvertureDeCompteModule {

}
