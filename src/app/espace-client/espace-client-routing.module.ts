import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/_core/_guards';

import { CommandesComponent } from './commandes/commandes.component';

import { RetoursComponent } from './retours/retours.component';

import { ComparateurComponent } from '../comparateur/comparateur.component';

import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';

import { ContratsComponent } from './contrats/contrats.component';

import { NewslettersComponent } from './newsletters/newsletters.component';

import { ReliquatsComponent } from './reliquats/reliquats.component';


import { NgModule } from '@angular/core';
import { EspaceClientComponent } from './espace-client.component';
import { PaniersEnregistresComponent } from './paniers-enregistres/paniers-enregistres.component';
import { MdpChangementComponent } from './mdp-changement/mdp-changement.component';
import { DematerialisationComponent } from './dematerialisation/dematerialisation.component';

import { ReglementComponent } from './reglement/reglement.component';
import { ReglementSuccesComponent } from './reglement/reglement-succes/reglement-succes.component';
import { SuiviRetourComponent } from './retours/suivi-retour/suivi-retour.component';
import { ConfirmationRetourComponent } from './retours/confirmation-retour/confirmation-retour.component';
import { FinRetourComponent } from './retours/fin-retour/fin-retour.component';
import { ContratModificationComponent } from './contrats/contrat-modification/contrat-modification.component';
import { TarifMarqueComponent } from './tarif-marque/tarif-marque.component';
import { DevisComponent } from './devis/devis.component';
import { SuiviActiviteComponent } from './suivi-activite/suivi-activite.component';
import { ValidationDevisComponent } from './devis/validation-devis/validation-devis.component';
import { DevisConfirmationComponent } from './devis/devis-confirmation/devis-confirmation.component';
import { NumerosDeSerieComponent } from './numeros-de-serie/numeros-de-serie.component';
import { CotationComponent } from './cotation/cotation.component';
import { ContactsComponent } from './contacts/contacts.component';
import {StatsComponent} from "@/espace-client/stats/stats.component";
import {AddFormComponent} from "@/espace-client/stats/add-form/add-form.component";
import {EditFormComponent} from "@/espace-client/stats/edit-form/edit-form.component";
import {FinanceComponent} from "@/espace-client/finance/finance.component";

const routes: Routes = [
  {
    path: '',
    component: EspaceClientComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      filDArianne: [{ url: 'espace-client', label: 'Espace Client', guarded: true }]
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'commandes',
        component: CommandesComponent,
        data: {
          filDArianne: [{ url: 'commandes', label: 'Commandes', guarded: true }]
        }
      },
      {
        path: 'reliquats',
        component: ReliquatsComponent,
        data: {
          filDArianne: [{ url: 'reliquats', label: 'Reliquats', guarded: true }]
        }
      },
      {
        path: 'devis',
        component: DevisComponent,
        data: {
          filDArianne: [{ url: 'devis', label: 'Devis', guarded: true }]
        }
      },
      /*{
        path: 'devis/validation',
        component: ValidationDevisComponent,
        data: {
          filDArianne: [
            { url: 'devis', label: 'Devis', guarded: false },
            { url: 'validation', label: 'Validation de devis', guarded: true }
          ]
        }
      },*/
      {
        path: 'devis/confirmation',
        component: DevisConfirmationComponent,
        data: {
          filDArianne: [
            { url: 'devis', label: 'Devis', guarded: false },
            { url: 'confirmation', label: 'Confirmation de devis', guarded: true }
          ]
        }
      },
      {
        path: 'numeros-de-serie',
        component: NumerosDeSerieComponent,
        data: {
          filDArianne: [{ url: 'numeros-de-serie', label: 'Numéros de série', guarded: true }]
        }
      },
      {
        path: 'retours',
        component: RetoursComponent,
        data: {
          filDArianne: [{ url: 'retours', label: 'Demande RMA', guarded: true }]
        }
      },
      {
        path: 'confirmation-retour',
        component: ConfirmationRetourComponent,
        data: {
          filDArianne: [
            { url: 'retours', label: 'Demande RMA' },
            { url: 'confirmation-retour', label: 'Confirmation RMA', guarded: true }
          ]
        }
      },
      {
        path: 'fin-retour',
        component: FinRetourComponent,
        data: {
          filDArianne: [
            { url: 'retours', label: 'Demande RMA', guarded: true },
            { url: 'confirmation-retour', label: 'Confirmation RMA', guarded: true },
          ]
        }
      },
      {
        path: 'suivi',
        component: SuiviRetourComponent,
        data: {
          filDArianne: [{ url: 'suivi', label: 'Suivi RMA', guarded: true }]
        }
      },

      {
        path: 'reglement',
        component: ReglementComponent,
        data: {
          filDArianne: [{ url: 'reglement', label: 'Règlement', guarded: true }]
        }
      },
      {
        path: 'reglement-succes',
        component: ReglementSuccesComponent,
        data: {
          filDArianne: [{ url: 'reglement-succes', label: 'Règlement', guarded: true }]
        }
      },
      {
        path: 'comparateur',
        component: ComparateurComponent,
        data: {
          filDArianne: [{ url: 'comparateur', label: 'Comparateur', guarded: false }],
        },
      },
      {
        path: 'paniers-sauvegardes',
        component: PaniersEnregistresComponent,
        data: {
          filDArianne: [{ url: 'paniers-sauvegardes', label: 'Paniers Sauvegardés', guarded: true }]
        }
      },
      {
        path: 'utilisateurs',
        component: UtilisateursComponent,
        data: {
          filDArianne: [
            { url: 'utilisateurs', label: 'Gestion des utilisateurs', guarded: true }
          ]
        }
      },
      {
        path: 'contrats',
        component: ContratsComponent,
        data: {
          filDArianne: [{ url: 'contrats', label: 'Contrats et Licences', guarded: true }]
        }
      },
      {
        path: 'contrats/modification',
        redirectTo: 'contrats',
       
        /* 
       Pour l'instant on redirige vers la page des contrats
       data: {
          filDArianne: [
            { url: 'contrats', label: 'Contrats et Licences' },
            { url: 'modification', label: 'Modification de licence', guarded: true }
          ]
        } */
      },
      {
        path: 'newsletters',
        component: NewslettersComponent,
        data: {
          filDArianne: [{ url: 'newsletters', label: 'Newsletter', guarded: true }]
        }
      },
      {
        path: 'tarif-marque',
        component: TarifMarqueComponent,
        data: {
          filDArianne: [{ url: 'tarif-marque', label: 'Tarif Marque', guarded: true }]
        }
      },
      {
        path: 'mdp-changement',
        component: MdpChangementComponent,
        data: {
          filDArianne: [{ url: 'mdp-changement', label: 'Changement de mot de passe', guarded: true }]
        }
      },
      {
        path: 'dematerialisation',
        component: DematerialisationComponent,
        data: {
          filDArianne: [{ url: 'dematerialisation', label: 'Dématérialisation', guarded: true }]
        }
      },
      {
        path: 'cotation',
        component: CotationComponent,
        data: {
          filDArianne: [{ url: 'cotation', label: 'Cotation', guarded: true }]
        }
      },
      {
        path: 'suivi-activite',
        component: SuiviActiviteComponent,
        data: {
          filDArianne: [{ url: 'suivi-activite', label: "Suivi d'activité", guarded: true }]
          // GUARDED CHANGE
        }
      },
      {
        path: 'contacts',
        component: ContactsComponent,
        data: {
          filDArianne: [{ url: 'contacts', label: 'Contacts', guarded: true }]
        }
      },
      {
        path: 'adresses',
        component: StatsComponent,
        data: {
          filDArianne: [{ url: 'adresses', label: 'Adresses client' }]
        }
      },
      {
        path: 'adresses/ajout-adresse',
        component: AddFormComponent,
        data: {
          filDArianne: [
            { url: 'adresses', label: 'Adresses client' },
            { url: 'ajout-adresse', label: 'Ajout d\'adresse'}
          ]
        }
      },
      {
        path: 'adresses/modifier-adresse/:id',
        component: EditFormComponent,
        data: {
          filDArianne: [
            { url: 'adresses', label: 'Adresses client' },
            { url: 'modifier-adresse', label: 'Modification d\'adresse'}
          ]
        }
      },
      {
        path: 'finance',
        component: FinanceComponent,
        data: {
          filDArianne: [{ url: 'finance', label: 'Relevé de compte', guarded: true }]
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspaceClientRoutingModule { }
