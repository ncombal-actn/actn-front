import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginFormComponent} from "@/_util/components/login-form/login-form.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LoginFormComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error = false;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.error = this.router.getCurrentNavigation()?.extras.state?.error ?? false;
  }
}
