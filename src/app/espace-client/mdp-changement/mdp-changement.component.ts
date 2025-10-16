import {Component, OnInit} from '@angular/core';
import {Validators, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuthenticationService} from '@core/_services';
import {PasswordService} from '@core/_services/password.service';
import {ConfirmedValidator} from '@/_util/validators/confirmed.validator';
import {MatError, MatFormField} from "@angular/material/form-field";
import {PasswordShowInputComponent} from "@/_util/components/password-show-input/password-show-input.component";
import {MatInput} from "@angular/material/input";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-mdp-changement',
  standalone: true,
  imports: [
    MatError,
    MatFormField,
    PasswordShowInputComponent,
    ReactiveFormsModule,
    MatInput,
    MatIconButton
  ],
  templateUrl: './mdp-changement.component.html',
  styleUrls: ['./mdp-changement.component.scss']
})
export class MdpChangementComponent implements OnInit {

  loading = false;
  submitted = false;
  success = false;
  clicked = false;
  minLength = 8;
  maxLength = 20;
  hide = true;
  show = false;

  mdpChangementForm: FormGroup;

  constructor(private fb: FormBuilder, private user: AuthenticationService, private password: PasswordService) {


  }

  ngOnInit() {
    this.mdpChangementForm = this.fb.group({
        oldMdp: ['', [Validators.required]],
        newMdp: ['', [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]],
        confirmNewMdp: ['', [Validators.required]]
      },
      {validator: ConfirmedValidator('newMdp', 'confirmNewMdp')}
    );
  }

  onSubmit(): void {
    this.clicked = true;
    if (this.mdpChangementForm.valid) {
      this.loading = true;
      this.success = false;
      this.password.changePassword(`${this.user.currentUser.id}`, this.mdpChangementForm.value.oldMdp, this.mdpChangementForm.value.newMdp)
        .subscribe(res => this.reponseRecu(res));
    }
  }

  reponseRecu(res: JSON): void {
    this.loading = false;
    this.success = res['success'];
    this.submitted = true;
  }

  showPassword(): void {
    this.show = true;
  }

  hidePassword(): void {
    this.show = false;
  }

  tapPassword(): void {
    this.show = !this.show;
  }

}
