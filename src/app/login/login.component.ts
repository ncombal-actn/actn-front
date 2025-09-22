import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    error = false;

    constructor(private router: Router) { }

    ngOnInit(): void {
/*         this.error = history.state.error ?? false;
 */
this.error = this.router.getCurrentNavigation()?.extras.state?.error ?? false;
}
}
