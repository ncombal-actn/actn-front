import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroupDirective, NgForm, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take, takeLast } from 'rxjs/operators';

import { AuthenticationService, WindowService } from '@/_core/_services';
import { environment } from '@env';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'app-reglement',
	templateUrl: './reglement.component.html',
	styleUrls: ['./reglement.component.scss']
})
export class ReglementComponent implements OnInit {

	environment = environment;


	matcher = new MyErrorStateMatcher();

	httpOptions = {
		headers: new HttpHeaders({
			'Content-Type':  'application/json',
			'Authorization': 'my-auth-token'
		})
	};

	reglementForm:FormGroup;
	constructor(
		private fb: FormBuilder,
		private httpClient: HttpClient,
		public authService: AuthenticationService,
		private window: WindowService
	) {

	 }



	ngOnInit() {
		this.reglementForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			reference: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
			amount: ['', [Validators.required, Validators.pattern('^[0-9]*(\\.|,)?[0-9]{0,2}$')]]
		});
	}

	onSubmit() {
		// TODO: Use EventEmitter with form value

		/*this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
		.pipe(
			catchError(this.handleError('addHero', hero))
		);*/
		if (this.reglementForm.valid)
		{
			this.httpClient
			.get(`${environment.apiUrl}/ReglementLibre.php`,{
					withCredentials: true,
					responseType: 'json',
					params: {
						sauveref: this.reglementForm.value.reference,
						mail: this.reglementForm.value.email.toLowerCase(),
						vads_amount: this.reglementForm.value.amount
					}
				})
			.pipe(takeLast(1))
			.subscribe(
				(data) =>
				{					
					this.window.open(data[1].url, "_self");
					return true;
				},
				(error) =>
				{

				}
			);
		}
		else
		{
			return false;
		}
	}

}
