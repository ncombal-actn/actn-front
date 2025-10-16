import { Routes } from '@angular/router';

import { PanierComponent } from './panier.component';
import { ValidationPanierComponent } from './validation-panier/validation-panier.component';
import { ConfirmationPanierComponent } from './confirmation-panier/confirmation-panier.component';
import { AuthGuard } from '@core/_guards/auth.guard';
import { PanierValidationGuard } from '@core/_guards';

export const PANIER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PanierComponent,
    canActivate: [AuthGuard],
    data: {
      filDArianne: [{ url: 'panier', label: 'Panier', guarded: true }],
    },
  },
  {
    path: 'commander/valider',
    component: ValidationPanierComponent,
    canActivate: [AuthGuard],
    data: {
      filDArianne: [
        { url: 'panier', label: 'Panier', guarded: false },
        { url: 'commande', label: 'Commande', guarded: true },
      ],
    },
  },
  {
    path: 'commander/devis',
    component: ValidationPanierComponent,
    canActivate: [AuthGuard, PanierValidationGuard],
    data: {
      filDArianne: [
        { url: 'panier', label: 'Panier', guarded: false },
        { url: 'devis', label: 'Devis', guarded: true },
      ],
    },
  },
  {
    path: 'confirmation',
    component: ConfirmationPanierComponent,
    canActivate: [AuthGuard],
    data: {
      filDArianne: [
        { url: 'panier', label: 'Panier', guarded: false },
        { url: 'confirmation', label: 'Confirmation', guarded: true },
      ],
    },
  },
];
