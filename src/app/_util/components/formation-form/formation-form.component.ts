import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// HTTP RXJS
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
// ENV
import { environment } from '@env';
// MODELS
import { Produit } from '@/_util/models';


@Component({
  selector: 'app-formation-form',
  templateUrl: './formation-form.component.html',
  styleUrls: ['./formation-form.component.scss']
})
export class FormationFormComponent implements OnInit
{
	@Input() produit: Produit;
	@Input() cartQte: number = 1;

	formationFormData: { html: string, marquelib: string } = null;
	formationFormDOM: SafeHtml = null;

	openGoogleFrom: boolean = false; // if true, display the google form popup

	environment = environment;

	constructor(
		private sanitizer: DomSanitizer,
		private http: HttpClient,
	) { }

	ngOnInit(): void
	{
		this.retrieveGoogleFormUrl();
	}

	retrieveGoogleFormUrl()
	{
		this.http.get<{ html: string, marquelib: string }>(
				`${environment.apiUrl}/retrieveGoogleFormUrl.php`,
				{
					withCredentials: true,
					responseType: 'json',
					params: {
						formtype: this.produit.niveaucode2
					}
				}
			)
			.pipe(take(1))
			.subscribe(
				(ret) =>
				{
					this.formationFormData = ret;
					if (ret.html)
					{
						this.formationFormDOM = this.sanitizer.bypassSecurityTrustHtml(ret.html);
					}
				},
				(err) =>
				{
				}
			);
	}

	openGoogleForm() {
		this.openGoogleFrom = true;
	}
	closeGoogleForm() {
		this.openGoogleFrom = false;
	}

}
