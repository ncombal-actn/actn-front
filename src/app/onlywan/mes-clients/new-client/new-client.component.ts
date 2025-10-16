import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthenticationService } from '@core/_services';
import { RmaService } from '@core/_services/rma.service';
import { environment } from '@env';
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatHint} from "@angular/material/select";
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-new-client',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TitleWLineComponent,
    MatFormField,
    MatHint,
    MatLabel,
    MatError
  ],
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {

  _currentCient$
  addrForm:FormGroup;
  addrFormSaved:FormGroup;
  constructor(private fb: FormBuilder,
              private rmaService: RmaService,
              private http: HttpClient,
              private router: Router,
              private predictionService: AuthenticationService) {

              }

  ngOnInit(): void {
    this.addrForm = this.fb.group({
      reference: ["", [ Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,30}$/)]],
      numeroLigne: ["", [Validators.maxLength(20), Validators.pattern(/^[0-9+_-]{1,20}/)]],
     // raisonSociale: ["", [ Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,30}$/)]],
      nomPrenom: ["", [Validators.required, Validators.maxLength(26), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,26}$/)]],
      telephoneContact: ["", [Validators.required, Validators.maxLength(20), Validators.pattern(/^[0-9+_-]{1,20}$/)]],
      mail: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
      nomSite: ["", [Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,100}$/)]],
      addr: ["", [ Validators.maxLength(26), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,26}$/)]],
      codePostal: ["", [Validators.maxLength(5), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,30}$/)]],
      ville: ["", [ Validators.maxLength(26), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,26}$/)]],
      telephoneSociete: ["", [Validators.required, Validators.maxLength(20), Validators.pattern(/^[0-9+_-]{1,20}$/)]]

    });


    this.addrFormSaved = this.fb.group({
      reference: ["", [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,30}$/)]],
      numeroLigne: ["", [Validators.maxLength(20), Validators.pattern(/^[0-9+_-]{1,20}/)]],
     // raisonSociale: ["", [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,30}$/)]],
      nomPrenom: ["", [Validators.required, Validators.maxLength(26), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,26}$/)]],
      telephoneContact: ["", [Validators.required, Validators.maxLength(20), Validators.pattern(/^[0-9+_-]{1,20}$/)]],
      mail: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
      nomSite: ["", [Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,100}$/)]],
      addr: ["", [ Validators.maxLength(26), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,26}$/)]],
      codePostal: ["", [ Validators.maxLength(5), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,5}$/)]],
      ville: ["", [Validators.maxLength(26), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,26}$/)]],
      telephoneSociete: ["", [Validators.required, Validators.maxLength(20), Validators.pattern(/^[0-9+_-]{1,20}$/)]]
    });

    this.predictionService.currentUser$.subscribe(data=>{
      this.addrForm.patchValue({
        nomPrenom: data.TIERSIND,
        telephoneContact: data.TIERSTEL,
        mail: data.TIERSMEL,
       })
       if (data) {
       /*  this.addrForm.get('clientraisonsociale').disable();
        this.addrForm.get('nClientACTN').disable();
        this.addrForm.get('nomClientFinal').disable(); */
       }
    })

  }
  ///////////////////CLIENT
  selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid')
  ]);






  addAddress() {
    if (this.checkAddForm()) {

      this.addAddressFormate()

     /*  let sub;

      sub.unsubscribe;
      this.router.navigate(['/espace-client/stats']).then(r => location.reload()) */
    }
  }

  checkAddForm() {
    return this.addrForm.get('reference').valid
    && this.addrForm.get('numeroLigne').valid
    //  && this.addrForm.get('raisonSociale').valid
      && this.addrForm.get('nomPrenom').valid
      && this.addrForm.get('telephoneContact').valid
      && this.addrForm.get('mail').valid
      && this.addrForm.get('nomSite').valid
      && this.addrForm.get('addr').valid
      && this.addrForm.get('codePostal').valid
      && this.addrForm.get('ville').valid
      && this.addrForm.get('telephoneSociete').valid
  }

  fakeValue() {


    this.addrForm.setValue({
      reference: '11',
    //  raisonSociale: '11',
    numeroLigne:'1111111111',
      nomPrenom: 'LUCASSSSSS',
      telephoneContact: '0674415256',
      mail: '111@11.fr',
      nomSite: '111 11 fr',
      addr: '11111',
      codePostal: '09100',
      ville: 'pamiers',
      telephoneSociete: '0674415256',

    })
  }

  addAddressFormate() {
    this.addrFormSaved.value.reference = this.rmaService.removeAccents(this.addrForm.value.reference).toUpperCase();
    this.addrFormSaved.value.numeroLigne = this.rmaService.removeAccents(this.addrForm.value.numeroLigne).toUpperCase();
  //  this.addrFormSaved.value.raisonSociale = this.rmaService.removeAccents(this.addrForm.value.raisonSociale).toUpperCase();
    this.addrFormSaved.value.nomPrenom = this.rmaService.removeAccents(this.addrForm.value.nomPrenom).toUpperCase();
    this.addrFormSaved.value.telephoneContact = this.rmaService.removeAccents(this.addrForm.value.telephoneContact).toUpperCase();
    this.addrFormSaved.value.mail = this.addrForm.value.mail;
    this.addrFormSaved.value.nomSite = this.rmaService.removeAccents(this.addrForm.value.nomSite).toUpperCase();
    this.addrFormSaved.value.addr = this.rmaService.removeAccents(this.addrForm.value.addr).toUpperCase();
    this.addrFormSaved.value.codePostal = this.rmaService.removeAccents(this.addrForm.value.codePostal).toUpperCase();
    this.addrFormSaved.value.ville = this.rmaService.removeAccents(this.addrForm.value.ville).toUpperCase();
    this.addrFormSaved.value.telephoneSociete = this.rmaService.removeAccents(this.addrForm.value.telephoneSociete).toUpperCase();
    this.addAddressRequest();
  }

  addAddressRequest() {

    return this.http
      .get(`${environment.apiUrl}clientOnlywanMaj.php`, {
        withCredentials: true,
        responseType:'text',

         params: {
          mode: 'ADD',
          reference: this.addrFormSaved.value.reference,
          numeroLigne: this.addrFormSaved.value.numeroLigne,
       //   raisonSociale: this.addrFormSaved.value.raisonSociale,
          nomPrenom: this.addrFormSaved.value.nomPrenom,
          telephoneContact: this.addrFormSaved.value.telephoneContact,
          mail: this.addrFormSaved.value.mail,
          nomSite: this.addrFormSaved.value.nomSite,
          addr: this.addrFormSaved.value.addr,
          codePostal: this.addrFormSaved.value.codePostal,
          ville: this.addrFormSaved.value.ville,
          telephoneSociete: this.addrFormSaved.value.telephoneSociete
        }
      })
      .subscribe((data) => {
        this.router.navigate(['/onlywan/mesClients/listeDeMesClients'])
      });

  }

}
