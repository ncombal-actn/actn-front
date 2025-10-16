import { Routes } from '@angular/router';
import { SipTrunkComponent } from './sip-trunk/sip-trunk.component';
import { CartesSimComponent } from './cartes-sim/cartes-sim.component';
import { HebergementWebComponent } from './hebergement-web/hebergement-web.component';
import { CloudPbxCentrexComponent } from './cloud-pbx-centrex/cloud-pbx-centrex.component';

export const NOS_OFFRES_ROUTES: Routes = [
  {
    path: 'sipTrunk',
    component: SipTrunkComponent,
    data: {
      filDArianne: [{ url: 'sipTrunk', label: 'sip Trunk' }]
    }
  },
    {
    path: 'cartesSim',
    component: CartesSimComponent,
    data: {
      filDArianne: [{ url: 'cartesSim', label: 'cartes sim' }]
    }
  },
  {
    path: 'hebergementWeb',
    component: HebergementWebComponent,
    data: {
      filDArianne: [{ url: 'hebergementWeb', label: 'hébergement web' }]
    }
  },
  {
    path: 'cloudPbxCentrex',
    component: CloudPbxCentrexComponent,
    data: {
      filDArianne: [{ url: 'cloudPbxCentrex', label: 'cloud PBX centrex' }]
    }
  }
];
