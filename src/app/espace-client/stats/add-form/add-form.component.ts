import { Component, OnInit } from '@angular/core';
import {Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AdresseService, AuthenticationService} from "@core/_services";
import {shareReplay} from "rxjs/operators";
import {RmaService} from "@services/rma.service";
import { HttpClient } from "@angular/common/http";
import {environment} from '@env';
import {Router, RouterLink} from '@angular/router';
import {MatCheckbox} from "@angular/material/checkbox";
import {AsyncPipe} from "@angular/common";
import {MatHint} from "@angular/material/select";
import {MatFormField, MatLabel} from "@angular/material/form-field";

@Component({
  selector: 'app-add-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    MatCheckbox,
    MatFormField,
    MatHint,
    MatLabel
  ],
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit {

  subscription;
  pays$ = null;
  addrForm: FormGroup;
  addrFormSaved: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthenticationService,
    public adresseService: AdresseService,
    private rmaService: RmaService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.pays$ = this.adresseService.getCountries().pipe(shareReplay(1));

    this.addrForm = this.fb.group({
      nomAddr: ["", [Validators.required, Validators.maxLength(40), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,40}$/)]],
      addr1: ["", [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,30}$/)]],
      addr2: ["", [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,30}$/)]],
      codePostal: ["", [Validators.required, Validators.maxLength(5), Validators.pattern(/^[0-9]{5}$/)]],
      ville: ["", [Validators.required, Validators.maxLength(26), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,26}$/)]],
      telephone: ["", [Validators.required, Validators.maxLength(15), Validators.pattern(/^[0-9+_-]{1,15}$/)]],
      pays: ["FR", [Validators.required]],
      defaut: ''
    });

    this.addrFormSaved = this.fb.group({
      nomAddr: ["", [Validators.required, Validators.maxLength(40), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,40}$/)]],
      addr1: ["", [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,30}$/)]],
      addr2: ["", [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,30}$/)]],
      codePostal: ["", [Validators.required, Validators.maxLength(5), Validators.pattern(/^[0-9]{5}$/)]],
      ville: ["", [Validators.required, Validators.maxLength(26), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,26}$/)]],
      telephone: ["", [Validators.required, Validators.maxLength(15), Validators.pattern(/^[0-9+_-]{1,15}$/)]],
      pays: ["FR", [Validators.required]],
      defaut: ''
    });
  }

  changePays(){
    if(this.addrForm.get('pays').value != 'FR'){
      this.addrForm.get('codePostal').clearValidators();
      this.addrForm.get('codePostal').reset();
    }else{
      this.addrForm.get('codePostal').addValidators([Validators.required, Validators.maxLength(5), Validators.pattern(/^[0-9]{5}$/)]);
      this.addrForm.get('codePostal').reset();
    }
  }

  addAddress(){
    if(this.checkAddForm()){
      this.addAddressFormate()
      this.addAddressRequest(

      )
    }
    else {
      console.log('Formulaire invalide');
     /*  this.addrFormSaved.value.nomAddr,
        this.addrFormSaved.value.addr1,
        this.addrFormSaved.value.addr2,
        this.addrFormSaved.value.codePostal,
        this.addrFormSaved.value.ville,
        this.addrFormSaved.value.telephone,
        this.addrFormSaved.value.pays,
        this.addrFormSaved.value.defaut */
    }
  }

  checkAddForm() {
    return this.addrForm.get('nomAddr').valid
      && this.addrForm.get('addr1').valid
      && this.addrForm.get('addr2').valid
      && this.addrForm.get('codePostal').valid
      && this.addrForm.get('ville').valid
      && this.addrForm.get('telephone').valid
      && this.addrForm.get('pays').valid
  }

  addAddressFormate(){
    this.addrFormSaved.value.nomAddr = this.rmaService.removeAccents(this.addrForm.value.nomAddr).toUpperCase();
    this.addrFormSaved.value.addr1 = this.rmaService.removeAccents(this.addrForm.value.addr1).toUpperCase();
    this.addrFormSaved.value.addr2 = this.rmaService.removeAccents(this.addrForm.value.addr2).toUpperCase();
    this.addrFormSaved.value.codePostal = this.rmaService.removeAccents(this.addrForm.value.codePostal).toUpperCase();
    this.addrFormSaved.value.ville = this.rmaService.removeAccents(this.addrForm.value.ville).toUpperCase();
    this.addrFormSaved.value.telephone = this.rmaService.removeAccents(this.addrForm.value.telephone).toUpperCase();
    this.addrFormSaved.value.pays = this.rmaService.removeAccents(this.addrForm.value.pays).toUpperCase();

  }

  addAddressRequest() {
    return this.http
      .get<any>(`${environment.apiUrl}/Adresse.php`, {
        withCredentials: true,
        responseType: 'json',
        params: {
          action: 'ADD',
          codead: '',
          nom: this.addrFormSaved.value.nomAddr,
          ad1: this.addrFormSaved.value.addr1,
          ad2: this.addrFormSaved.value.addr2,
          cp: this.addrFormSaved.value.codePostal,
          ville: this.addrFormSaved.value.ville,
          phone: this.addrFormSaved.value.telephone,
          payx: this.addrFormSaved.value.pays,
          defaut: this.addrFormSaved.value.defaut
        }
      })
      .subscribe((data) => {


        this.router.navigate(['/espace-client/adresses'])
      });
  }
}
