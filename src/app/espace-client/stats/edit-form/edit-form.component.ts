import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { RmaService } from "@services/rma.service";
import { shareReplay } from "rxjs/operators";
import { AdresseService, AuthenticationService } from "@core/_services";
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit {
  subscription;
  pays$ = null;
  loading = true;
  addrData;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private rmaService: RmaService,
    public authService: AuthenticationService,
    public adresseService: AdresseService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.pays$ = this.adresseService.getCountries().pipe(shareReplay(1));
    this.pays$.subscribe();
    this.editForm = this.createFormGroup();
    this.getAddress();
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      idAddr: "",
      nomAddr: ["", [Validators.required, Validators.maxLength(40), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,40}$/)]],
      addr1: ["", [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,30}$/)]],
      addr2: ["", [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{0,30}$/)]],
      codePostal: ["", [Validators.required, Validators.maxLength(5), Validators.pattern(/^[0-9]/)]],
      ville: ["", [Validators.required, Validators.maxLength(26), Validators.pattern(/^[a-zA-Z0-9 éèêàâîïÉÈÊÀÂÎÏ'-]{1,26}$/)]],
      telephone: ["", [Validators.required, Validators.maxLength(15), Validators.pattern(/^[0-9+_-]{1,15}$/)]],
      pays: ["FR", [Validators.required]],
      defaut: '',
      oldName: ""
    });
  }

  changePays() {
    const codePostalControl = this.editForm.get('codePostal');
    if (this.editForm.get('pays').value !== 'FR') {
      codePostalControl.clearValidators();
    } else {
      codePostalControl.setValidators([Validators.required, Validators.maxLength(5), Validators.pattern(/^[0-9]{5}$/)]);
    }
    codePostalControl.reset();
  }

  getAddress() {
    this.adresseService.getAddress()
      .subscribe(data => {
        this.addrData = data.find(val => val.codeadresse === this.route.snapshot.params['id']);
        this.editStart(this.addrData);
        this.editForm.patchValue(this.addrData);
        this.loading = false;
      });
  }

  editStart(adresse) {
    this.editForm.patchValue({
      idAddr: adresse.codeadresse,
      oldName: adresse.nom,
      nomAddr: adresse.nom,
      addr1: adresse.adresse1,
      addr2: adresse.adresse2,
      codePostal: adresse.codepostal,
      ville: adresse.ville,
      telephone: adresse.phone,
      pays: adresse.paysiso,
      defaut: adresse.defaut
    });
  }

  editAddress() {
    if (this.adresseService.checkForm(
      this.editForm.get('nomAddr').valid,
      this.editForm.get('addr1').valid,
      this.editForm.get('addr2').valid,
      this.editForm.get('codePostal').valid,
      this.editForm.get('ville').valid,
      this.editForm.get('telephone').valid,
      this.editForm.get('pays').valid
    )) {
      this.editAddressFormate();
      this.adresseService.editAddressRequest(
        this.editForm.value.idAddr,
        this.editForm.value.nomAddr,
        this.editForm.value.addr1,
        this.editForm.value.addr2,
        this.editForm.value.codePostal,
        this.editForm.value.ville,
        this.editForm.value.telephone,
        this.editForm.value.pays,
        this.editForm.value.defaut
      ).subscribe(() => {
        this.router.navigate(['/espace-client/adresses']);
      });
    }
  }

  editAddressFormate() {
    const formValues = this.editForm.value;
    this.editForm.patchValue({
      nomAddr: this.rmaService.removeAccents(formValues.nomAddr).toUpperCase(),
      addr1: this.rmaService.removeAccents(formValues.addr1).toUpperCase(),
      addr2: this.rmaService.removeAccents(formValues.addr2).toUpperCase(),
      codePostal: this.rmaService.removeAccents(formValues.codePostal).toUpperCase(),
      ville: this.rmaService.removeAccents(formValues.ville).toUpperCase(),
      telephone: this.rmaService.removeAccents(formValues.telephone).toUpperCase(),
      pays: this.rmaService.removeAccents(formValues.pays).toUpperCase()
    });
  }

  goBack(): void {
    this.location.back();
  }
}
