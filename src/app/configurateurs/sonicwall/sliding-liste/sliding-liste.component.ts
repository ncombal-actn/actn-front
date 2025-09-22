import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { SlidingListeComponent as BaseSlidingListeComponent } from '@/configurateurs/zyxel/sliding-liste/sliding-liste.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthenticationService, WindowService, SvgService } from '@core/_services';
import { ProduitService } from '@core/_services/produit.service';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import {faChevronRight, faFilePdf} from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: 'conf-sliding-liste',
	templateUrl: './sliding-liste.component.html',
	styleUrls: ['./sliding-liste.component.scss']
})
export class SlidingListeComponent extends BaseSlidingListeComponent implements OnInit {

	constructor(
		protected produitService: ProduitService,
		protected auth: AuthenticationService,
		protected window: WindowService,
		protected breakpointObserver: BreakpointObserver,
		protected ngZone: NgZone,
		@Inject(PLATFORM_ID) protected platformId: any,
		public svg: SvgService,
		protected configService: ConfigurateurService
	) {
		super(produitService, auth, window, breakpointObserver, ngZone, platformId, svg, configService);
	}

	ngOnInit(): void {
        this._listenBreakpoints();
        this._listenResize();
	}

  protected readonly faChevronRight = faChevronRight;
  protected readonly faFilePdf = faFilePdf;
}
