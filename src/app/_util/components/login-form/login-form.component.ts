import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {AuthenticationService, ComponentsInteractionService, WindowService} from '@/_core/_services';
import {FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {take} from 'rxjs/operators';
import {PasswordShowInputComponent} from "@/_util/components/password-show-input/password-show-input.component";
import {MatError, MatFormField} from "@angular/material/form-field";
import {NgTemplateOutlet} from "@angular/common";
import {MatInput} from "@angular/material/input";

/**
 * Formulaire de login.
 */
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    PasswordShowInputComponent,
    MatFormField,
    MatError,
    NgTemplateOutlet,
    MatInput,
    RouterLinkActive
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Input() errorMessage = false;

  /**
   * True si l'un des inputs est actuellement en focus.
   */
  @Input() hasFocusedInput: boolean;
  @Output() hasFocusedInputChange = new EventEmitter<boolean>();
  /**
   * Event de connection pour recharger les ressources du header
   */
  @Output() EventLogIn = new EventEmitter<void>();
  loginForm: FormGroup;
  /**
   * True si l'input de login est en focus.
   */
  loginFocused = false;
  /**
   * True si l'input de password est en focus.
   */
  passwordFocused = false;
  /**
   * True si la connection échoue
   */
  connectionFailure = false;

  returnUrl = '';

  constructor(
    public authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private componentsInteractionService: ComponentsInteractionService,
    private windowService: WindowService,
  ) { }

  ngOnInit() {


    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });

    // GET ROUTE PARAMS
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.returnUrl = params.returnUrl;
    });
  }

  logIn() {
    this.connectionFailure = false;
    this.authService.login(
      encodeURIComponent(this.loginForm.get('login').value),
      encodeURIComponent(this.loginForm.get('password').value),
    ).subscribe((c) => {
      if (c == null) {
        this.connectionFailure = true;
      } else {
        this.EventLogIn.emit();
        if (this.returnUrl) {
          this.router.navigate([this.returnUrl]);
        }
      }
    });
    this.inputUnFocused();

    if (this.router.url === '/ouverture-de-compte') {
      this.router.navigate(['/accueil']);
    }
  }

  inputFocused() {
    this.hasFocusedInputChange.emit(true);
  }

  inputUnFocused() {
    this.hasFocusedInputChange.emit(false);
  }

  close() {
    this.componentsInteractionService.sideNavigationLine.fireOpenSideNav('toggleEspaceClient');
  }

}
