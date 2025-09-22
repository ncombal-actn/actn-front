import { ConfigurateurService } from '@/configurateurs/configurateur.service';
import { User } from '@/_util/models/user';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@core/_services';
import { environment } from '@env';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

const phoneRegex = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;

@Component({
	selector: 'conf-help',
	templateUrl: './help.component.html',
	styleUrls: ['./help.component.scss', '../zyxel.scss']
})
export class HelpComponent implements OnInit, OnDestroy {

	showHelpPopup = false;
	public user: User = null;
	public helpForm: FormGroup = null;
	public isMessageSent = false;
	public formValidated = false;

	protected _destroy$ = new Subject<void>();

	constructor(
		public configService: ConfigurateurService,
		protected fb: FormBuilder,
		protected authService: AuthenticationService,
		protected http: HttpClient
	) {
	}
	
	ngOnInit(): void {
		this.creationFormulaire();
		this.authService.currentUser$.pipe(takeUntil(this._destroy$)).subscribe(user => { this.user = user; this.creationFormulaire(); });
		this.configService.reload$.pipe(takeUntil(this._destroy$)).subscribe(() => this.creationFormulaire());
	}

	ngOnDestroy(): void {
		this._destroy$.next();
		this._destroy$.complete();
	}

	creationFormulaire(): void {
		this.helpForm = this.fb.group({
			client: [this.user?.TIERS ?? '', [Validators.required]],
			societe: [this.user?.TIERSNOM ?? '', [Validators.required]],
			nom: [this.user?.TIERSIND ?? '', [Validators.required]],
			email: [this.user?.TIERSMEL ?? '', [Validators.required, Validators.email]],
			telephone: [this.user?.TIERSTEL ?? '', [Validators.required, Validators.pattern(phoneRegex)]],
			objet: ['', []],
			message: ['', []]
		});
	}

	onHideHelpPopup(): void {
		this.showHelpPopup = false;
	}

	onAskForHelp(): void {
		this.formValidated = true;
		if (this.helpForm.valid) {
			const packet = [];
			this.configService.configuration.configuration.forEach(group => {
				group.forEach(category => {
					category.forEach(option => {
						if (option?.option?.['produit'].value && option.quantite > 0) {
							const produit = this.configService.produits.find(p => p.reference === option.option['produit'].value);
							packet.push([produit.marquelib, produit.reference, produit.prix, option.quantite]);
						}
					});
				});
			});
			this.http.post(
				`${environment.apiUrl}/ConfigurateurMail.php`,
				{
					client: this.helpForm.get('client').value,
					societe: this.helpForm.get('societe').value,
					nom: this.helpForm.get('nom').value,
					email: this.helpForm.get('email').value,
					telephone: this.helpForm.get('telephone').value,
					objet: this.helpForm.get('objet').value,
					message: this.helpForm.get('message').value,
					marque: this.configService.marque,
					configuration: JSON.stringify(packet),
				},
				{
					withCredentials: true
				}
			).pipe(
				take(1)
			).subscribe(() => {
				this.isMessageSent = true;
			});
		}
	}

}
