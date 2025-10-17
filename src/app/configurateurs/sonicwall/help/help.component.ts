import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelpComponent as ZyxeHelpComponent } from '@/configurateurs/zyxel/help/help.component';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '@core/_services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'conf-help',
  standalone: true,
  templateUrl: '../../zyxel/help/help.component.html',
  styleUrls: ['./help.component.scss', '../sonicwall.scss']
})
export class HelpComponent extends ZyxeHelpComponent implements OnInit, OnDestroy {

	constructor(
		public configService: ConfigurateurService,
		protected fb: FormBuilder,
		protected authService: AuthenticationService,
		protected http: HttpClient
	) {
		super(configService, fb, authService, http);
	}

}
