import { Location } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroupDirective,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  AuthenticationService,
  UserService,
  WindowService,
} from "@core/_services";
import { User } from "@/_util/models";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-utilisateurs",
  templateUrl: "./utilisateurs.component.html",
  styleUrls: ["./utilisateurs.component.scss"],
})
export class UtilisateursComponent implements OnInit {
  @ViewChild("overlayElement") overlayElement: ElementRef;
  contacts = new Array();
  accesWeb = new Array();
  boolCont = false;
  boolWeb = false;
  ajout = false;
  change = false;
  error = false;
  principalBool = false;
  changePass = false;
  web = true;
  idPerson = ""; //'droitacces','numindividu','servicelib'
  displayedColumns: string[] = [
    "nom",
    "mail",
    "telephone",
    "service",
    "role",
    "identifiant",
    "autorisemailling",
    "droitcommande",
    "principal",
    "modif",
  ];
  dataSource = new MatTableDataSource<UserWeb>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  listService = [
    "Achats",
    "Technique",
    "SAV",
    "Comptabilité",
    "Logistique",
    "Direction",
    "Facture Demat.",
  ];
  listServiceAcro = ["ACH", "TEC", "SAV", "CPT", "LOG", "DIR", "FAC"];
  numActive = "";
  idActive = "";
  principal = "";
  textBtnErr = "Un des champs n'est pas rempli ou est incorrect";

  adminNbr: number; // nombre d'admins, il doit toujours au moins y en avoir 1
  indexOfAccesWebUserBeingEdited: number = null; // index of the user in 'this.accesWeb' currently being edited
  webForm: FormGroup;
  acroForm: FormGroup;
  // contForm:FormGroup;
  accesWebForm: FormGroup;
  idForm: FormGroup;
  changeForm: FormGroup;
  userWeb$ = new BehaviorSubject<Array<UserWeb>>([]);
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    public auth: AuthenticationService,
    private window: WindowService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.webForm = this.fb.group({
      nom: ["", [Validators.required, Validators.maxLength(40)]],
      mail: [
        "",
        [Validators.required, Validators.maxLength(70), Validators.email],
      ],
      tel: ["", [Validators.maxLength(15)]],
      service: ["", Validators.required, []],
      commande: ["", []],
      mailing: ["", []],
      mdp: ["", [Validators.pattern(/^.{0}$|^.{7,20}$/)]],
      admin: ["", [this.notRemovingTheLastAdmin.bind(this)]],
    });
    /* this.contForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(40)]],
      mail: ['', [Validators.required, Validators.maxLength(70), Validators.email]],
      tel: ['', [Validators.required, Validators.maxLength(15) ]],
      service: ['', []],
      commande: ['', []],
      mailing: [false, []],
    }); */
    this.idForm = this.fb.group({
      ident: ["", [Validators.maxLength(20), Validators.minLength(4)]],
    });
    this.changeForm = this.fb.group({
      ident: [
        "",
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(4),
        ],
      ],
      mdp: ["", [Validators.required]],
    });
    this.refreshList();
    this.masquerChamps();
    this.idForm.get("ident").valueChanges.subscribe((value) => {
      if (this.web === true && !value && this.ajout === false) {
        this.changePassword();
      }
      if (!value) {
        this.masquerChamps();
        this.web = false;
      } else {
        this.afficherChamps();
        this.web = true;
      }
    });
  }

  masquerChamps() {
    this.webForm.get("commande").disable();
    //this.webForm.get("mailing").disable();
    this.webForm.get("mdp").disable();
    this.webForm.get("admin").disable();
    //this.webForm.get("mdp").clearValidators();
    //this.webForm.get('mdp').updateValueAndValidity();
    // Définir les valeurs des champs cachés à null lorsque l'identifiant est vide
    // Par exemple, si vous avez d'autres champs à cacher, définissez leurs valeurs ici
  }

  afficherChamps() {
    this.webForm.get("commande").enable();
    //.webForm.get("mailing").enable();
    this.webForm.get("mdp").enable();
    this.webForm.get("admin").enable();
    //this.webForm.get("mdp").setValidators([Validators.required])
    // Réinitialisez les valeurs des champs cachés à leurs valeurs par défaut lorsque l'identifiant est rempli
    // Par exemple, si vous avez d'autres champs à cacher, définissez leurs valeurs par défaut ici
    //this.webForm.get('mdp').updateValueAndValidity();
    //this.webForm.get('mdp').updateValueAndValidity();
  }



  refreshList() {
    this.accesWeb = [];
    this.contacts = [];
    this.userService.getClients().subscribe((data) => {

      this.contacts = data;
      this.contacts.forEach((contact) => {
        this.accesWeb.push(contact);
      });

      this.userWeb$.next(data);
      this.userWeb$.subscribe((d) => {
        this.dataSource.data = d;
      });
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // enable edit if the current user is admin
      // this.principalBool = this.principal.toUpperCase() === this.auth.currentUser['TIERSUSR'].trim().toUpperCase();
      if (this.auth.currentUser.role == "admin") {
        this.principalBool = true;
      }
      this.countAdmins();
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  /**
   * Ferme les formulaires
   */
  close(form1: FormGroupDirective, form2: FormGroupDirective) {
    if (!!form1) {
      form1.resetForm();
    }
    if (!!form2) {
      form2.resetForm();
    }
    //this.contForm.reset();
    this.webForm.reset();
    this.idForm.reset();
    this.boolCont = false;
    this.boolWeb = false;
    this.ajout = false;
    this.error = false;
    this.change = false;
    this.changePass = false;
    //  this.web = false;
    this.numActive = "";
    this.idActive = "";
    this.textBtnErr = "Un des champs n'est pas rempli ou est incorrect";
    this.indexOfAccesWebUserBeingEdited = null;
    this.overlayElement.nativeElement.click();
  }

  /**
   * Ouvre le formulaire 'contForm'
   */
  /* openCont(index) {
    this.numActive = this.contacts[index].numindividu;
    this.idActive = '';
    this.boolCont = true;
    this.contForm.setValue({
      nom: this.contacts[index].nom,
      mail: this.contacts[index].mail,
      tel: this.contacts[index].telephone,
      service: this.contacts[index].service,
      commande: this.contacts[index].droitcommande,
      mailing: this.contacts[index].autorisemailling === 'O'
    });
  } */

  /**
   * Ouvre le formulaire 'webForm'
   */
  openWeb(i, idperson) {
    const index = this.accesWeb.findIndex((obj) => obj.numindividu === i);

    this.indexOfAccesWebUserBeingEdited = index;
    this.numActive = this.accesWeb[index].numindividu;
    this.idActive = this.accesWeb[index].identifiant;
    this.boolWeb = true;
    this.web = true;
    this.webForm.setValue({
      nom: this.accesWeb[index].nom,
      mail: this.accesWeb[index].mail,
      tel: this.accesWeb[index].telephone,
      service: this.accesWeb[index].service,
      mdp: "",
      commande: this.accesWeb[index].droitcommande,
      mailing: this.accesWeb[index].autorisemailling === "O",
      admin: this.accesWeb[index].role == "A" ? true : false,
    });

    this.idForm.setValue({
      ident: this.accesWeb[index].identifiant,
    });
    this.idPerson = idperson;
  }

  /**
   * Vérifie et valide le formulaire 'webForm' pour mettre à jour un compte d'utilisateur
   */
  onSubmitWeb() {
    if (this.webForm.status === "VALID") {
      this.userService
        .updtClients(this.webForm, this.numActive, this.idForm.value.ident)
        .subscribe(
          (ret) => {
            if (ret[0].erreur == "N") {
              this.refreshList();
              this.overlayElement.nativeElement.click();
              this.refresh();
            } else {
              this.refresh();
              this.textBtnErr = ret[0].message;
              this.error = true;
              alert("utilisateur crée");
            }

            this.refresh();
          },
          (error) => {
            //Si le php fonctionnent mais pas liaison avec angular refresh la page
            if (error.status === 200) {
              this.refresh();
            } else {
            }
          }
        );
    } else {
      this.showError();
    }
  }
  refresh(): void {
    /*  this.router.navigateByUrl("/refresh", { skipLocationChange: true }).then(() => {

      this.router.navigate([decodeURI(this.location.path())]);
    }); */
    //this.window.reload()
  }

  switchUser() {
    this.change = true;
  }

  /**
   * Vérifie et valide le formulaire 'webForm' pour ajouter un compte utilisateur au client
   */
  onSubmitAddWeb() {

    if(this.idForm.value.ident === null){
      this.idForm.value.ident = ""
    }
    if (this.webForm.status === "VALID" && this.idForm.status === "VALID") {
      this.userService
        .addClients(this.webForm, this.idForm.value.ident)
        .subscribe(
          (ret) => {
            this.refreshList();
            this.refresh();
            this.overlayElement.nativeElement.click();
            if (ret[0].erreur == "N") {
              this.overlayElement.nativeElement.click();
              this.refreshList();
              this.refresh();

            } else {
              this.refresh();
              this.textBtnErr = ret[0].message;
              this.error = true;
            }

            this.refresh();
          },
          (error) => {
            //Si le php fonctionnent mais pas liaison avec angular refresh la page

            if (error.status === 200) {
              this.refresh();
            } else {
            }
          }
        );
    } else {
      this.showError();
    }
  }

  addCont() {
    this.ajout = true;
    this.numActive = "";
    this.idActive = "";
    this.boolCont = true;
  }

  addWeb() {
    this.ajout = true;
    this.numActive = "";
    this.idActive = "";
    this.boolWeb = true;
  }

  changePassword() {
    this.changePass = true;
  }
  changeWeb() {
    this.web = !this.web;
  }

  /**
   * supprime un compte
   */
  suppr() {
    this.userService.supprClients(this.numActive).subscribe(
      (ret) => {
        if (ret) {
          this.refreshList();
          this.refresh();
          this.overlayElement.nativeElement.click();
        }
      },
      (error) => {
        //Si le php fonctionnent mais pas liaison avec angular refresh la page

        if (error.status === 200) {
          this.refresh();
        } else {
          this.refresh();
        }
      }
    );
  }

  countAdmins(): number {
    let nbrOfAdmins: number = 0;

    this.accesWeb.forEach((element) => {
      if (element.role == "A") {
        nbrOfAdmins++;
      }
    });
    this.adminNbr = nbrOfAdmins;
    return nbrOfAdmins;
  }

  showError(): void {
    this.error = true;
    this.textBtnErr = "Un des champs n'est pas rempli ou est incorrect";
  }

  notRemovingTheLastAdmin(admin: FormControl) {
    if (this.adminNbr <= 1) {
      // s'il n'y a plus qu'un admin...
      if (
        this.indexOfAccesWebUserBeingEdited !== null &&
        this.accesWeb[this.indexOfAccesWebUserBeingEdited]
      ) {
        if (
          !admin.value &&
          this.accesWeb[this.indexOfAccesWebUserBeingEdited].role == "A"
        ) {
          // ...et que l'on est en train d'essayer de lui retirer son rôle...
          return { RemovingTheLastAdmin: { valid: false } }; // ... alors on invalide le formulaire
        }
      }
    }

    return null;
  }
}
export class UserWeb {
  nom: String;
  //adresse: String;
  mail: String;
  telephone: String;
  identifiant: String;
  service: String;
  principal: String;
  droitCommande: String;
  autorisemailling: String;
  droitacces: String;
  numindividu: String;
  role: String;
  servicelib: String; //,adresse:String
  constructor(
    nom: String,
    mail: String,
    telephone: String,
    identifiant: String,
    service: String,
    principal: String,
    droitCommande: String,
    autorisemailling: String,
    droitacces: String,
    numindividu: String,
    role: String,
    servicelib: String
  ) {
    this.nom = nom;
    // this.adresse=adresse
    this.mail = mail;
    this.telephone = telephone;
    this.identifiant = identifiant;
    this.service = service;
    this.principal = principal;
    this.droitCommande = droitCommande;
    this.autorisemailling = autorisemailling;
    this.droitacces = droitacces;
    this.numindividu = numindividu;
    this.role = role;
    this.servicelib = servicelib;
  }
}
