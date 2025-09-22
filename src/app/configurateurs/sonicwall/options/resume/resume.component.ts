import { Component, NgZone, OnInit } from '@angular/core';
import { ResumeComponent as BaseResumeComponent } from '@/configurateurs/zyxel/options/resume/resume.component';
import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { AuthenticationService, ComponentsInteractionService } from '@core/_services';

@Component({
	selector: 'conf-resume',
	templateUrl: '../../../zyxel/options/resume/resume.component.html',
	styleUrls: ['./resume.component.scss']
})
export class ResumeComponent extends BaseResumeComponent implements OnInit {

	constructor(
		public configService: ConfigurateurService,
		protected authService: AuthenticationService,
		public componentsInteractionService: ComponentsInteractionService,
		protected ngZone: NgZone
	) {
		super(configService, authService, componentsInteractionService, ngZone);
	}

}
