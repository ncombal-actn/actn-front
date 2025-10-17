import { Component, OnInit } from '@angular/core';
import { OptionsComponent as ZyxeOptionsComponent } from '@/configurateurs/zyxel/options/options.component';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, ComponentsInteractionService, SvgService } from '@core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-options',
  standalone: true,
  templateUrl: '../../zyxel/options/options.component.html',
  styleUrls: ['./options.component.scss'],
  animations: [
    trigger('expandVertical', [
      state(
        'open',
        style({
          height: '*'
        })
      ),
      state(
        'closed',
        style({
          height: '2em'
        })
      ),
      transition('open => closed', animate('300ms ease-in-out')),
      transition('closed => open', animate('300ms ease-in-out'))
    ]),
    trigger('expandVerticalTo0', [
      state(
        'open',
        style({
          height: '*'
        })
      ),
      state(
        'closed',
        style({
          height: '0'
        })
      ),
      transition('open => closed', animate('300ms ease-in-out')),
      transition('closed => open', animate('300ms ease-in-out'))
    ])
  ]
})
export class OptionsComponent extends ZyxeOptionsComponent implements OnInit {

	constructor(
		protected produitService: ProduitService,
		protected router: Router,
		protected route: ActivatedRoute,
		protected fb: FormBuilder,
		protected authService: AuthenticationService,
		public componentsInteractionService: ComponentsInteractionService,
		public configService: ConfigurateurService,
		public svg: SvgService
	) {
		super(configService, router, route, fb, authService, componentsInteractionService, produitService, svg);
	}

}
