import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlocPrixComponent as ZyxeBlocPrixComponent } from '@/configurateurs/zyxel/bloc-prix/bloc-prix.component';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { ActivatedRoute } from '@angular/router';
import { ComponentsInteractionService, AuthenticationService } from '@core/_services';

@Component({
	selector: 'conf-bloc-prix',
	templateUrl: '../../zyxel/bloc-prix/bloc-prix.component.html',
	styleUrls: ['./bloc-prix.component.scss']
})
export class BlocPrixComponent extends ZyxeBlocPrixComponent implements OnInit, OnDestroy {

	constructor(
		public configService: ConfigurateurService,
		public componentsInteractionService: ComponentsInteractionService,
		protected authService: AuthenticationService,
		protected route: ActivatedRoute
	) {
		super(configService, componentsInteractionService, authService, route);
	}

}
