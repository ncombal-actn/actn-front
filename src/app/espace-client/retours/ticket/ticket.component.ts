// ANGULAR
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// ENVIRONMENT
import { environment } from '@env';
// RXJS
import { take } from 'rxjs/operators';
// FORM
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// SERVICES
import { AuthenticationService } from '@core/_services/authentication.service';

@Component({
	selector: 'app-ticket',
	templateUrl: './ticket.component.html',
	styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit
{

	ticketForm: FormGroup;

	gravites: string[] = ["Mineure", "Majeure", "Critique"];

	ticketConfirmed: boolean = false;

	constructor(
		protected fb: FormBuilder,
		protected authService: AuthenticationService,
		protected http: HttpClient
	) {

	}

	ngOnInit(): void
	{
		this.ticketForm = this.fb.group({
			clientID: [this.authService.currentUser.id, Validators.required],
			nom: [this.authService.currentUser.TIERSNOM, Validators.required],
			email: [this.authService.currentUser.TIERSMEL, [Validators.required, Validators.email]],
			telephone: [this.authService.currentUser.TIERSTEL, [Validators.required, Validators.pattern('^[0-9 +-]*$')]],

			sujet: ['', Validators.required],
			gravite: [this.gravites[0], Validators.required],
			materiel: ['', Validators.required],
			numeroSerie: [''],
			description: ['', Validators.required]
		});
	}

	onFormSubmit()
	{

		if (this.ticketForm.valid)
		{
			this.submitRequest();
		}

	}

	submitRequest()
	{
		this.http.get(`${environment.apiUrl}/ticket.php`, {
				withCredentials: true,
				responseType: 'json',
				params: {
					clientID: this.ticketForm.value.clientID,
					nom: this.ticketForm.value.nom,
					email: this.ticketForm.value.email,
					telephone: this.ticketForm.value.telephone,
					sujet: this.ticketForm.value.sujet,
					gravite: this.ticketForm.value.gravite,
					materiel: this.ticketForm.value.materiel,
					numeroSerie: this.ticketForm.value.numeroSerie,
					description: this.ticketForm.value.description
				}
			})
		.pipe(take(1))
		.subscribe(
			(ret) =>
			{

				this.ticketConfirmed = true;
			},
			(error) =>
			{
			}
		);
	}

	public fmaj(str): string
	{
	  return str.charAt(0).toUpperCase() + str.slice(1);
	}

}
