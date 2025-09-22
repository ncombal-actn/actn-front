import { ConfirmedValidator } from '@/_util/validators/confirmed.validator';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from '@core/_services/password.service';
import { take } from 'rxjs/operators';

@Component({
	selector: 'app-mdp-recuperation',
	templateUrl: './mdp-recuperation.component.html',
	styleUrls: ['./mdp-recuperation.component.scss']
})
export class MdpRecuperationComponent implements OnInit {

	mdpRestaurationForm: FormGroup = new FormGroup({});

    minLength = 8;
    maxLength = 20;

	isLoading = false;
	isSubmitted = false;
	isSent = false;

	private _token = '';
	private _tokenID = '';

	constructor(
		private passwordService: PasswordService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder
	) {
		
	}

	ngOnInit(): void {
		this.mdpRestaurationForm = this.fb.group({
			newMdp: ['', [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]],
			confirmNewMdp: ['', [Validators.required]]
		},
			{ validator: ConfirmedValidator('newMdp', 'confirmNewMdp') }
		);
		this.activatedRoute.queryParams
			.pipe(take(1))
			.subscribe(params => {
				this._token = params.token ?? '';
				this._tokenID = params.token_id ?? '';
				if (this._token === '' || this._tokenID === '') {
					this.router.navigateByUrl('/');
				}
			});
	}

	onSubmit(): void {
		this.isSubmitted = true;
		if (this.mdpRestaurationForm.valid) {
			this.isLoading = true;
			this.passwordService.restaurationPassword(this._token, this._tokenID, this.mdpRestaurationForm.value.newMdp)
				.pipe(take(1))
				.subscribe(() => {
					this.isLoading = false;
					this.isSent = true;
				}, () => {
					this.isLoading = false;
				}, () => {
					this.isLoading = false;
				});
		}
	}

}
