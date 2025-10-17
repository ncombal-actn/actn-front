import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { PasswordService } from '@core/_services/password.service';
import { take } from 'rxjs/operators';
import {MatError, MatFormField} from "@angular/material/form-field";

/**
 * Formulaire de demande de renouvellement de mot de passe.
 */
@Component({
  selector: 'app-mdp-oublie',
  standalone: true,
  templateUrl: './mdp-oublie.component.html',
  imports: [
    ReactiveFormsModule,
    MatError,
    MatFormField
  ],
  styleUrls: ['./mdp-oublie.component.scss']
})
export class MdpOublieComponent implements OnInit {


	mdpOublieForm: FormGroup;
	isLoading = false;
	isSubmitted = false;
	isSent = false;

	constructor(
		private fb: FormBuilder,
		private mdp: PasswordService
	) { }


	ngOnInit(): void {
		this.mdpOublieForm = this.fb.group({
			email: ['', [Validators.required, Validators.maxLength(70), Validators.email]]
		});
	 }

	onSubmit(): void {
		this.isSubmitted = true;
		if (this.mdpOublieForm.valid) {
			this.isLoading = true;
			this.mdp.forgottenPassword(this.mdpOublieForm.value.email)
				.pipe(take(1))
				.subscribe(() => {
					this.isLoading = false;
					this.isSent = true;
				});
		}
	}
}
