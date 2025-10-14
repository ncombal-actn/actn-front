import {Component, inject, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
// import { ControlValueAccessor } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CaptchaService} from '../_core/_services/captcha.service';
import {environment} from '@env';
import {RmaService} from '@core/_services/rma.service';
import {AdresseService, CatalogueService, WindowService} from '@core/_services';
import {map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MatCheckboxChange} from "@angular/material/checkbox";
import {RECAPTCHA_V3_SITE_KEY, RecaptchaModule, RecaptchaV3Module, ReCaptchaV3Service} from 'ng-recaptcha';
import {UtilModule} from "@/_util/util.module";
import {CommonModule} from "@angular/common";
/*function confirmPasswordValidator(control: AbstractControl): {[key: string]: boolean} | null
{
	if (control.value !== undefined && (isNaN(control.value) || control.value != this.password)) {
		return { 'confirmPassword': true };
	}
	return (null);
}
*/

@Component({
  selector: 'app-ouverture-de-compte',
  standalone: true,
  imports: [
    RecaptchaV3Module,
    UtilModule,
    CommonModule,
    RecaptchaModule,
  ],
  providers: [
    ReCaptchaV3Service,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    }
  ],
  templateUrl: './ouverture-de-compte.component.html',
  styleUrls: ['./ouverture-de-compte.component.scss']
})
export class OuvertureDeCompteComponent implements OnInit {
  recaptchaV3Service = inject(ReCaptchaV3Service);
  loading = false;
  // formeJuridiqueList = ["SA", "SARL", "Auto Entrepreneur"];
  typesDeVoie = [];
  aidePopupBonDeLivraison = "livraison"
  aideEmailDemat = "email"
  checkboxState = false;
  showMessageCheckbox = false;
  isTVA = true;
  disBut = false;
  listActivite = ['Alarmiste', 'Boutique', 'Centre de recherche', 'Electricien', 'End User', 'Fabriquant & Fournisseur', 'Organisme de formation', 'Grossiste', 'National', 'Opérateur FAI', 'Organisme de financement', 'Retail/VPC/E-commerce', 'Revendeur/Installateur/Intégrateur', 'Téléphoniste', 'Vidéo installateur'];
  listActiviteAcro = ['ALA', 'BOU', 'CR', 'ELE', 'END', 'FAB', 'FOR', 'GRO', 'NAT', 'OPE', 'ORG', 'RET', 'REV', 'TEL', 'VID'];
  listCity: any = [] ;
  //ngModel to retrieve the password and make a RegExp
  password: string;
  selectedValue: string = '';
  adresses$: Observable<any>;
  captcha_code;
  captcha_url = "https://www.google.com/recaptcha/api/siteverify";
  captcha_secret = "6LcQMGQqAAAAAGWJiCmYrOyTWCLg0Rmd6y6ZT5K7";
  captcha_response = false;
  displayError = '';
  displaySuccess = '';
  // Observable of all countries
  pays$ = null;
  ouvertureDeCompteForm: FormGroup;
  browserIsModzilla: boolean = false;
  private script: HTMLScriptElement | null = null;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private rmaService: RmaService,
    private captchaService: CaptchaService,
    private router: Router,
    private catalogueSerive: CatalogueService,
    protected adresseService: AdresseService,
    private windowService: WindowService,
    private renderer: Renderer2) {
  }

  showOptions(event: MatCheckboxChange): void {
    this.checkboxState = event.checked;
    if (this.checkboxState) {
      this.showMessageCheckbox = false;
    }
  }

  ngOnInit() {

   // this.loadReCaptcha();

    this.ouvertureDeCompteForm = this.fb.group({
      societe: this.fb.group({
        raisonSociale: ['', [Validators.required, Validators.maxLength(40)]],
        activite: ['', [Validators.required]],
        telephone: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^[0-9+_ -]+$/)]],
        portable: ['', [Validators.maxLength(15), Validators.pattern(/^[0-9+_-]*$/)]],
        tvaID: ['', [this.tvaValidator]], //, this.IsTva [Validators.maxLength(14),Validators.pattern('^\\S*$')]
        /*ape: ['', [Validators.maxLength(5)]],*/
        groupeEco: ['', [Validators.maxLength(40)]],
        siret: ['', [Validators.required, Validators.maxLength(14), this.validateSiret]],
        base: ['BFR', [Validators.required]]
      }),
      adminUser: this.fb.group({
        nom: ['', [Validators.required, Validators.maxLength(40)]],
        login: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/([a-zéèàç',-])+/i)]],
        password: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6), this.blankValidator()]],
        confirmPassword: ['', [Validators.required, Validators.maxLength(20), this.confirmPasswordValidator()]],
        email: ['', [Validators.required, Validators.maxLength(70), Validators.email]],
      }),
      comptaUser: this.fb.group({
        nom: ['', [Validators.required, Validators.maxLength(40)]],
        email: ['', [Validators.required, Validators.maxLength(70), Validators.email]],
        telephone: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^[0-9+_ -]+$/)]],
      }),
      demat: this.fb.group({
        email: ['', [Validators.required, Validators.maxLength(70), Validators.email]],
      }),
      logistique: this.fb.group({
        email: ['', [Validators.required, Validators.maxLength(70), Validators.email]],
      }),
      facturation: this.fb.group({
        /*emailDemat: ['', [Validators.required, Validators.maxLength(70), Validators.email]],*/
        adresse1: ['', [Validators.required, Validators.maxLength(30)]],
        adresse2: ['', [Validators.maxLength(30)]],
        codePostal: ['', [Validators.required, Validators.maxLength(5)]],
        commune: ['', [Validators.required, Validators.maxLength(26)]],
        pays: ['', [Validators.required]],
        cgv: ['', [Validators.required]],
        newsletter: ['', []]
      })
    });

    this.browserIsModzilla = this.windowService.taMereLaPute();
    this.catalogueSerive.setFilArianne(false);
    this.disBut = false;
    this.helpPopupEmail();
    this.helpPopupBonDeLivraison();

    // Get all countries from distant API
    this.pays$ = this.adresseService.getCountries();

    this.ouvertureDeCompteForm.get('facturation').get('pays').setValue('FR');

    this.ouvertureDeCompteForm.get('facturation').get('codePostal').valueChanges.subscribe((value) => {


      this.getCity(value)
    })
  }

  loadReCaptcha(): void {
    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
      this.script = this.renderer.createElement('script');
      this.script.src = 'https://www.google.com/recaptcha/api.js?render=6LcQMGQqAAAAAGWJiCmYrOyTWCLg0Rmd6y6ZT5K7';
      this.script.async = true;
      this.script.defer = true;
      document.body.appendChild(this.script);
    }
  }

  removeReCaptcha(): void {
    if (this.script) {
      this.script.remove();
      this.script = null;
    }
  }


  ngOnDestroy() {
  //  this.removeReCaptcha();
    this.catalogueSerive.setFilArianne(true);
  }

  tvaValidator(control: AbstractControl): { [key: string]: any } | null {
    const tvaIDValue = control.value;
    const siretValue = control.parent?.get('societe.siret')?.value;
    const paysValue = control.parent?.get('facturation.pays')?.value;

    // Vérifier si le pays est 'fr' et si tvaID ne contient pas siret
    if (paysValue === 'France' && tvaIDValue && siretValue && !tvaIDValue.includes(siretValue)) {
      return {tvaIDInvalid: true};
    }

    return null; // Validation réussie
  }

  onSubmit() {
    this.displaySuccess = '';
    let formValid = true;

    if (!this.checkboxState) {
      this.showMessageCheckbox = true;
      formValid = false;

    }

    // check if the Validators are true
    if (this.ouvertureDeCompteForm.status == "VALID") {


      // if there is a siret, test if true
      if (this.ouvertureDeCompteForm.value.societe.siret) {
        if (this.IsSiret(this.ouvertureDeCompteForm.value.societe.siret)) {

        } else {

          formValid = false;
        }
      } else {

      }

      // if there is a TVA nbr, test if true
      /* 			if (this.ouvertureDeCompteForm.value.societe.tvaID) {
              if (this.IsTva(this.ouvertureDeCompteForm.value.societe.tvaID)) {

              } else {

                this.isTVA = false;
                formValid = false;
              }
            } else {

            }
      */

      if (this.browserIsModzilla || this.captcha_response) {

      } else {

        formValid = false;
      }

    } else {

      formValid = false;
    }

    if (formValid == true) {
      this.disBut = true;

      this.captchat();
      /*this.displaySuccess = "Procédure d'ouverture de compte validée. Une copie des ces informations vous a été envoyé par mail.";
      setTimeout(
        ()=>
        {
          this.router.navigate(['ouverture-de-compte-confirmation']);
        },
        1500
      );*/
      // this.clearForm();
      // SI succes > retour à l'accueil après quelques secondes
    }
  }

  ouvertureDeCompte() {
    if(this.captcha_response){
      this.http
        .post<any>(`${environment.apiUrl}/OuvertureCompte.php`,
          {
            raisonSociale: this.rmaService.removeAccents(this.ouvertureDeCompteForm.value.societe.raisonSociale),
            activite: this.ouvertureDeCompteForm.value.societe.activite,
            telephone: this.ouvertureDeCompteForm.value.societe.telephone,
            portable: this.ouvertureDeCompteForm.value.societe.portable,
            tvaID: this.ouvertureDeCompteForm.value.societe.tvaID,
            groupeEco: this.ouvertureDeCompteForm.value.societe.groupeEco,
            siret: this.ouvertureDeCompteForm.value.societe.siret,

            nom: this.rmaService.removeAccents(this.ouvertureDeCompteForm.value.adminUser.nom),
            login: this.rmaService.removeAccents(this.ouvertureDeCompteForm.value.adminUser.login),
            password: this.ouvertureDeCompteForm.value.adminUser.password,
            email: this.ouvertureDeCompteForm.value.adminUser.email,

            adresse1: this.rmaService.removeAccents(this.ouvertureDeCompteForm.value.facturation.adresse1),
            adresse2: this.rmaService.removeAccents(this.ouvertureDeCompteForm.value.facturation.adresse2),
            codePostal: this.ouvertureDeCompteForm.value.facturation.codePostal,
            commune: this.rmaService.removeAccents(this.ouvertureDeCompteForm.value.facturation.commune),
            pays: this.rmaService.removeAccents(this.ouvertureDeCompteForm.value.facturation.pays),
            cgv: this.ouvertureDeCompteForm.value.facturation.cgv,
            newsletter: this.ouvertureDeCompteForm.value.facturation.newsletter,

            emailDemat: this.ouvertureDeCompteForm.value.demat.email,

            emailLogistique: this.ouvertureDeCompteForm.value.logistique.email,

            nomCompta: this.rmaService.removeAccents(this.ouvertureDeCompteForm.value.comptaUser.nom),
            emailCompta: this.ouvertureDeCompteForm.value.comptaUser.email,
            telephoneCompta: this.ouvertureDeCompteForm.value.comptaUser.telephone
          },
          {
            withCredentials: true,
            responseType: 'json',
          })
        .pipe(take(1))
        .subscribe(
          (result) => {
            this.displayError = '';
            this.displaySuccess = '';

            if (result[0].erreur != "N") {
              this.disBut = false;
              this.displayError = result[0].message;
            } else {
              this.displaySuccess = "Procédure d'ouverture de compte validée. Une copie des ces informations vous a été envoyé par mail.";
              setTimeout(
                () => {
                  this.router.navigate(['ouverture-de-compte-confirmation']);
                },
                1500
              );
              /*setTimeout(
                () => {
                  this.router.navigate(['/accueil']);
                },
                5000
              );*/
            }
          },
          (error) => {
          }
        );
    } else {
      console.log('captcha not resolved');
    }
  }

  clearForm() {
    this.ouvertureDeCompteForm.controls.societe.setValue({
      base: "",
      raisonSociale: '',
      activite: '',
      telephone: '',
      portable: '',
      tvaID: '',
      groupeEco: '',
      siret: ''
    });

    this.ouvertureDeCompteForm.controls.adminUser.setValue({
      nom: '',
      login: '',
      password: '',
      confirmPassword: '',
      email: '',
    });

    this.ouvertureDeCompteForm.controls.facturation.setValue({
      adresse1: '',
      adresse2: '',
      codePostal: '',
      commune: '',
      pays: '',
      cgv: '',
      newsletter: '',
    });

    this.ouvertureDeCompteForm.controls.demat.setValue({
      email: '',
    });

    this.ouvertureDeCompteForm.controls.logistique.setValue({
      email: '',
    });

    this.ouvertureDeCompteForm.controls.comptaUser.setValue({
      nom: '',
      email: '',
      telephone: '',
    });
  }

  validateSiret(siret: FormControl) {
    // if there is no SIRET return valid
    if (siret.value == "") {


      return null;
    }

    let estValide;
    if ((siret.value.length != 14) || (isNaN(siret.value)))
      estValide = {validateSiret: {valid: false}};
    else {
      // Donc le SIRET est un numérique à 14 chiffres
      // Les 9 premiers chiffres sont ceux du SIREN (ou RCS), les 4 suivants
      // correspondent au numéro d'établissement
      // et enfin le dernier chiffre est une clef de LUHN
      let somme = 0;
      let tmp;
      for (let cpt = 0; cpt < siret.value.length; cpt++) {
        if ((cpt % 2) == 0) { // Les positions impaires : 1er, 3è, 5è, etc...
          tmp = siret.value.charAt(cpt) * 2; // On le multiplie par 2
          if (tmp > 9)
            tmp -= 9;	// Si le résultat est supérieur à 9, on lui soustrait 9
        } else
          tmp = siret.value.charAt(cpt);
        somme += parseInt(tmp);
      }
      if ((somme % 10) == 0)
        estValide = null; // Si la somme est un multiple de 10 alors le SIRET est valide
      else
        estValide = {validateSiret: {valid: false}};
    }
    return estValide;
  }

  /**
   * @name  IsSiren
   * @param  Le code SIREN dont on veut vérifier la validité.
   * @return  Un booléen qui vaut 'true' si le code SIREN passé en paramètre est valide, false sinon.
   */
  IsSiren(siren) {
    let estValide;
    if ((siren.length != 9) || (isNaN(siren)))
      estValide = false;
    else {
      // Donc le SIREN est un numérique à 9 chiffres
      let somme = 0;
      let tmp;
      for (let cpt = 0; cpt < siren.length; cpt++) {
        if ((cpt % 2) == 1) { // Les positions paires : 2ème, 4ème, 6ème et 8ème chiffre
          tmp = siren.charAt(cpt) * 2; // On le multiplie par 2
          if (tmp > 9)
            tmp -= 9;	// Si le résultat est supérieur à 9, on lui soustrait 9
        } else
          tmp = siren.charAt(cpt);
        somme += parseInt(tmp);
      }
      estValide = (somme % 10) == 0;
    }
    return estValide;
  }

  /**
   * @name  IsSiret
   * @param  Le code SIRET dont on veut vérifier la validité.
   * @return  Un booléen qui vaut 'true' si le code SIRET passé en paramètre est valide, false sinon.
   */
  IsSiret(siret) {
    let estValide;
    if ((siret.length != 14) || (isNaN(siret)))
      estValide = false;
    else {
      // Donc le SIRET est un numérique à 14 chiffres
      // Les 9 premiers chiffres sont ceux du SIREN (ou RCS), les 4 suivants
      // correspondent au numéro d'établissement
      // et enfin le dernier chiffre est une clef de LUHN
      let somme = 0;
      let tmp;
      for (let cpt = 0; cpt < siret.length; cpt++) {
        if ((cpt % 2) == 0) { // Les positions impaires : 1er, 3è, 5è, etc...
          tmp = siret.charAt(cpt) * 2; // On le multiplie par 2
          if (tmp > 9)
            tmp -= 9;	// Si le résultat est supérieur à 9, on lui soustrait 9
        } else
          tmp = siret.charAt(cpt);
        somme += parseInt(tmp);
      }
      estValide = (somme % 10) == 0;
    }
    return estValide;
  }


  getCity(cityCode: string) {

    if (cityCode.length <= 3) {
      return null
    } else {

      this.adresseService.findCityByCityCode(cityCode).subscribe(data => {


        this.listCity = data


      });
    }
  }

  IsTva(champ: FormControl) {

    if (champ.value == "") {
      return true;
    }
    let reg = /^(RO\d{2,10}|GB\d{5}|(ATU|DK|FI|HU|LU|MT|CZ|SI)\d{8}|IE[A-Z\d]{8}|(DE|BG|EE|EL|LT|BE0|PT|CZ)\d{9}|CY\d{8}[A-Z]|(ES|GB)[A-Z\d]{9}|(BE0|PL|SK|CZ)\d{10}|(FR|IT|LV)\d{11}|(LT|SE)\d{12}|(NL|GB)[A-Z\d]{12})$/;
    if (reg.test(champ.value)) {
      return null;
    } else {
      return {IsTva: {valid: false}};
    }
  }

  /*confirmPasswordValidator(control: AbstractControl): {[key: string]: boolean} | null
  {
    if ( (control.value !== undefined) && (isNaN(control.value) || control.value != this.password) ) {
      return { 'confirmPassword': true };
    }
    34435011100011
    return (null);
  }*/

  confirmPasswordValidator(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value != this.password) {
        return {'confirmPassword': true};
      }
      return (null);
    };
  }

  blankValidator(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && c.value.includes(' ')) {
        return {'blank': true};
      }
      return (null);
    };
  }

  // -------------------------------------------------- //

  // RECAPTCHA PROCEDURE

  captcha_resolved(captchaResponse: string) {
    this.captcha_code = captchaResponse;
    this.loading = true;
    this.captcha_response = true;
    //Creation de la promesse de retour de vérification du token, et abonnement à la réponse du php
    /* 		this.verifCaptchaResponse(this.captcha_code).subscribe(
      data => {

          this.captcha_response = true;
        } else {
          this.captcha_response = true;
        }
        this.loading = false;
      },
      err => {

        //window.alert("Captcha refusé");
        this.captcha_response = true;
        this.loading = false;
      },
      () => { }
    ); */
  }


  //Fonction d'appel au service qui communique avec le php
  verifCaptchaResponse(tok) {
    return this.captchaService.sendToken(tok);
  }

  onAdresseChange(input: InputEvent): void {
    const adresse = this.ouvertureDeCompteForm.get('facturation').get('adresse1').value as string;
    if (adresse.length > 5) {
      this.adresses$ = this.adresseService.findAdresse(adresse)
        .pipe(
          take(1),
          map(adresses => {
            return adresses['features'].sort((ad1, ad2) => +ad2['properties']['score'] - +ad1['properties']['score']);
          })
        );
    }
  }

  onAdresseSelected(adresse: Array<any>): void {
    this.ouvertureDeCompteForm.get('facturation').get('codePostal').setValue(adresse['postcode']);
    this.ouvertureDeCompteForm.get('facturation').get('commune').setValue(adresse['city']);
    this.ouvertureDeCompteForm.get('facturation').get('pays').setValue('France');
  }

  // return true if based in France, else false
  isBasedInFrance(): boolean {
    return (this.ouvertureDeCompteForm.value.societe.base == 'BFR')
  }


  helpPopupEmail() {
    this.chargerAideEmail().subscribe(data => {
      this.aideEmailDemat = data;
    });
  }

  helpPopupBonDeLivraison() {
    this.chargerAideLivraison().subscribe(data => {
      this.aidePopupBonDeLivraison = data;
    });
  }

  // fonctions qui retourne la chaine de caractère contenant l'aide correspondante

  retournAideLivraison(): string {
    return this.aidePopupBonDeLivraison;
  }

  retournAideDemate(): string {
    return this.aideEmailDemat;
  }

  editValidatorsDependingOnBase(data): void
	{

		const siretCtrl = this.ouvertureDeCompteForm.get("societe.siret");
		const codePostalCtrl = this.ouvertureDeCompteForm.get("facturation.codePostal");
		//Si on est en france on doit avoir un siret et un codepostal valide sinon on desactive les champs
		if (data.value == "BFR")
		{
			//france
			siretCtrl.enable();
			siretCtrl.setValidators([
			Validators.required,
			Validators.maxLength(14),
			this.validateSiret
		]);


			codePostalCtrl.enable();
			codePostalCtrl.setValidators([Validators.required, Validators.maxLength(5)]);

		}
		else
		{
			//étranger
			siretCtrl.clearValidators();
			siretCtrl.setValue(null);
			siretCtrl.disable();

			codePostalCtrl.clearValidators();
			codePostalCtrl.setValue(null);
			codePostalCtrl.disable();
		}
		codePostalCtrl.updateValueAndValidity
		siretCtrl.updateValueAndValidity();
	}

  // lien avec le fichier texte de la bulle d'aide pour les numéros EAN
  chargerAideEmail(): Observable<string> {
    if (environment.production) {
      return this.http.get(`${environment.backend}/aideOuvertureDeCompte/aideEmaildématérialisés.txt`,
        {
          responseType: 'text'
        });
    } else {
      return this.http.get('../../assets/aideOuvertureDeCompte/aideEmaildématérialisés.txt',
        {
          responseType: 'text'
        });
    }
  }

  chargerAideLivraison(): Observable<string> {
    if (environment.production) {
      return this.http.get(`${environment.backend}/aideOuvertureDeCompte/aideEmailBonDeLivraison.txt`,
        {
          responseType: 'text'
        });
    } else {
      return this.http.get('../../assets/aideOuvertureDeCompte/aideEmailBonDeLivraison.txt',
        {
          responseType: 'text'
        });
    }
  }

  teste() {
    this.ouvertureDeCompteForm.controls.societe.get('raisonSociale').setValue('Test Company');
    this.ouvertureDeCompteForm.controls.societe.get('activite').setValue('Test Activity');
    this.ouvertureDeCompteForm.controls.societe.get('telephone').setValue('0123456789');
    this.ouvertureDeCompteForm.controls.societe.get('siret').setValue('34435011100011');
    this.ouvertureDeCompteForm.controls.adminUser.get('nom').setValue('Admin User');
    this.ouvertureDeCompteForm.controls.adminUser.get('login').setValue('admin');
    this.ouvertureDeCompteForm.controls.adminUser.get('password').setValue('password123');
    this.ouvertureDeCompteForm.controls.adminUser.get('confirmPassword').setValue('password123');
    this.ouvertureDeCompteForm.controls.adminUser.get('email').setValue('admin@example.com');
    this.ouvertureDeCompteForm.controls.facturation.get('adresse1').setValue('123 Main St');
    this.ouvertureDeCompteForm.controls.facturation.get('codePostal').setValue('75001');
    this.ouvertureDeCompteForm.controls.facturation.get('commune').setValue('Paris');
    this.ouvertureDeCompteForm.controls.facturation.get('pays').setValue('FR');
    this.ouvertureDeCompteForm.controls.facturation.get('cgv').setValue(true);
    this.ouvertureDeCompteForm.controls.comptaUser.get('nom').setValue('test');
    this.ouvertureDeCompteForm.controls.comptaUser.get('email').setValue('test@test.fr');
    this.ouvertureDeCompteForm.controls.comptaUser.get('telephone').setValue('0606060606');
    this.ouvertureDeCompteForm.controls.demat.get('email').setValue('test@test.fr');
    this.ouvertureDeCompteForm.controls.logistique.get('email').setValue('test@test.fr');
  }

  captchat(){
    this.recaptchaV3Service.execute('importantAction')
      .subscribe((token: string) => {
        this.ouvertureDeCompte();
      });
  }

}
