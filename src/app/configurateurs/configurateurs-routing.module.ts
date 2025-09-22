import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '@core/_guards';
import { ConfigurateursComponent } from './configurateurs.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'zyxel',
                loadChildren: () =>
                    import('./zyxel/zyxel.module').then((mod) => mod.ZyxelModule),
            },
            /* {
                path: 'sonicwall',
                loadChildren: () =>
                    import('./sonicwall/sonicwall.module').then((mod) => mod.SonicwallModule),
            }, */
            {
                path: ':reference',
                component: ConfigurateursComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfigurateursRoutingModule { }
