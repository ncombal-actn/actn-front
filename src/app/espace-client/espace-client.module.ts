import { NgModule } from '@angular/core';

import { EspaceClientRoutingModule } from './espace-client-routing.module';


import { CommandesComponent } from './commandes/commandes.component';
import { ReglementComponent } from './reglement/reglement.component';
import { ReglementSuccesComponent } from './reglement/reglement-succes/reglement-succes.component';
import { RetoursComponent } from './retours/retours.component';
import { StatsComponent } from './stats/stats.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { ContratsComponent } from './contrats/contrats.component';
import { NewslettersComponent } from './newsletters/newsletters.component';
import { EspaceClientComponent } from './espace-client.component';
import { ReliquatsComponent } from './reliquats/reliquats.component';
import { ComparateurComponent } from '../comparateur/comparateur.component';



import { CommonModule } from '@angular/common';
//import { SharedModule } from '../shared/shared.module';
import { MdpChangementComponent } from './mdp-changement/mdp-changement.component';
import { DematerialisationComponent } from './dematerialisation/dematerialisation.component';
import { ConfirmationRetourComponent } from './retours/confirmation-retour/confirmation-retour.component';
import { SuiviRetourComponent } from './retours/suivi-retour/suivi-retour.component';
import { FinRetourComponent } from './retours/fin-retour/fin-retour.component';
import { ContratModificationComponent } from './contrats/contrat-modification/contrat-modification.component';
import { TarifMarqueComponent } from './tarif-marque/tarif-marque.component';
import { PanierModule } from '@/panier/panier.module';
import { DevisComponent } from './devis/devis.component';
import { SuiviActiviteComponent } from './suivi-activite/suivi-activite.component';
import { ValidationDevisComponent } from './devis/validation-devis/validation-devis.component';
import { DevisConfirmationComponent } from './devis/devis-confirmation/devis-confirmation.component';
import { ContratsCommandesComponent } from './contrats/contrats-commandes/contrats-commandes.component';
import { DevisActnComponent } from './devis/devis-actn/devis-actn.component';
import { CotationComponent } from './cotation/cotation.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NumerosDeSerieComponent } from './numeros-de-serie/numeros-de-serie.component';
import { TicketComponent } from './retours/ticket/ticket.component';
import { MatInputModule as MatInputModule } from '@angular/material/input';
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field';

import { AddFormComponent } from './stats/add-form/add-form.component';
import { EditFormComponent } from './stats/edit-form/edit-form.component';
import {UtilModule} from "../_util/util.module";
import {MatSelectModule} from "@angular/material/select";
import {FinanceComponent} from "@/espace-client/finance/finance.component";
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmAddressComponent } from './stats/confirm-address/confirm-address.component';

@NgModule({
  declarations: [
    EspaceClientComponent,
    CommandesComponent,
    RetoursComponent,
    SuiviRetourComponent,
    StatsComponent,
    UtilisateursComponent,
    ContratsComponent,
    NewslettersComponent,
    ReliquatsComponent,
    MdpChangementComponent,
    DematerialisationComponent,
    ReglementComponent,
    ReglementSuccesComponent,
    ConfirmationRetourComponent,
    FinRetourComponent,
    ContratModificationComponent,
    TarifMarqueComponent,
    ComparateurComponent,
    DevisComponent,
    SuiviActiviteComponent,
    ValidationDevisComponent,
    DevisConfirmationComponent,
    ContratsCommandesComponent,
    DevisActnComponent,
    CotationComponent,
    ContactsComponent,
    NumerosDeSerieComponent,
    TicketComponent,

    AddFormComponent,
    EditFormComponent,
    FinanceComponent,
    ConfirmAddressComponent
  ],
  imports: [
    UtilModule,
    CommonModule,
    EspaceClientRoutingModule,
    PanierModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,

  ]
})
export class EspaceClientModule {}
