import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'conf-header-stepper',
    templateUrl: './header-stepper.component.html',
    styleUrls: ['./header-stepper.component.scss']
})
export class HeaderStepperComponent implements OnInit {

    @Input() step = 1;

    constructor(protected router: Router) { }

    ngOnInit(): void { }

    onClick(s: number): void {
        if (s < this.step) {
            switch (s) {
                case 1:
                    this.router.navigate(this.router.url.split('/').splice(0, 4));
                    break;
                case 2:
                    this.router.navigate(this.router.url.split('/').splice(0, 6));
                    break;
                case 3:
                    this.router.navigate(this.router.url.split('/').slice(0, -1).map(x => decodeURI(x)).concat('options'));
                    break;
            }
        }
    }

}
