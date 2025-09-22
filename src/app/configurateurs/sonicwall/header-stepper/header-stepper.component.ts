import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderStepperComponent as ZyxelHeaderStepper } from '../../zyxel/header-stepper/header-stepper.component';

@Component({
	selector: 'conf-header-stepper',
	templateUrl: '../../zyxel/header-stepper/header-stepper.component.html',
	styleUrls: ['../../zyxel/header-stepper/header-stepper.component.scss', './header-stepper.component.scss']
})
export class HeaderStepperComponent extends ZyxelHeaderStepper implements OnInit {

	constructor(
		protected router: Router
	) {
		super(router);
	}

	ngOnInit(): void { }

}
