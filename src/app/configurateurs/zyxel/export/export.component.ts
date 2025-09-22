import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ExportComponent as BaseExportComponent } from '@/configurateurs/export/export.component';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { FormBuilder } from '@angular/forms';
import { ProduitService } from '@core/_services/produit.service';
import { HttpClient } from '@angular/common/http';
import {AuthenticationService, WindowService} from '@core/_services';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
	selector: 'conf-pdf',
	templateUrl: '../../export/export.component.html',
	styleUrls: ['../styles/popup.scss', './export.component.scss'],
	providers: [DatePipe, CurrencyPipe]
})
export class ExportComponent extends BaseExportComponent implements OnInit, OnDestroy, AfterViewInit {

	constructor(
		public http: HttpClient,
		public configService: ConfigurateurService,
		public produitService: ProduitService,
		protected authService: AuthenticationService,
		protected fb: FormBuilder,
		protected renderer: Renderer2,
		protected datePipe: DatePipe,
		protected currencyPipe: CurrencyPipe,
    protected window: WindowService
	) {
		super(http, configService, produitService, authService, fb, renderer, datePipe, currencyPipe, window);
	}

}
