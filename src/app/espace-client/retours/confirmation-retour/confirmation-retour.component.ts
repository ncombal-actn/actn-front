import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RmaService} from '@core/_services/rma.service';
import {Router} from '@angular/router';
import {AuthenticationService, WindowService} from '@core/_services';

@Component({
  selector: 'app-confirmation-retour',
  templateUrl: './confirmation-retour.component.html',
  styleUrls: ['./confirmation-retour.component.scss']
})
export class ConfirmationRetourComponent implements OnInit, OnDestroy {

  /*
    produit -> produit selectionné par l'utilisateur pour être renvoyer
    noserieList -> liste des numéros de séries séléctionnés s'il y a plusieurs produit du même type
    quantite -> quantité des produits séléctionnés s'il n'ont pas de numéro de série (sinon la quantité est à 1)
  */
  produit: any = {};
  noserieList: Array<string> = [];
  quantite: number = 0;

  // adresse par défaut du client
  addrData: any = [];

  // permet de bloquer le submit si des champs obligatoires ne sont pas remplis
  submitting = false;

  // booleen qui vérifie la validité de l'extension du fichier
  extensionValid = true;

  /*
    envoieFile est de type string s'il n'y a pas de file et de type File si l'utilisateur en renseigne un
    envoiFileName correspond au nom du fichier
    authorizeType correspond aux extensions autorisées pour le fichier
  */
  envoiFile :any ;
  envoiFileName = '';
  authorizeType = ['txt', 'log', 'csv', 'xml'];

  /*
    aideProduitRef -> chaine de caractère qui contient l'aide pour les références produits
    aideNoSerie -> chaine de caractère qui contient l'aide pour les numéros de série
    aideEAN -> chaine de caractère qui contient l'aide pour les numéros EAN
  */
  aideMotif = '';
  aideAnomalie = '';
  aideSecurite = '';
  disableBTN = false;


  // cette liste permet de donner un nom a chaque numéro de série rentré à la main
  serieFormNom = ['serie1'];

  // ce compteur donne le numéro du prochain numéro de série
  compteur = 2;
  showPopup = false;
  showPopupAdd = false;
  serieForm: FormGroup = new FormGroup({});
  rmaForm:FormGroup = new FormGroup({});
  fileToUpload: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private rmaService: RmaService,
    public authService: AuthenticationService,
    private window: WindowService
  ) {

  }


  ngOnInit(): void {
    // rmaForm est le form group gérant le formulaire. Il contient les validators et autres données
    //ATTENTION les validators de ce formulaire sont dans rmaService
    this.rmaForm = this.fb.group({
      motif: ['', [Validators.required]],
      refRMA: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(600)]],
      login: ['', [Validators.maxLength(20)]],
      password: ['', [Validators.maxLength(20)]],
      IP: ['', []],
      file: ['', []],
      nom: ['', [Validators.required, Validators.maxLength(40)]],
      mail: ['', [Validators.required, Validators.maxLength(70), Validators.email]],
      tel: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^[0-9+\-.\s]*$/)]],
      cgv: ['', [Validators.required]],
      serie: ['']
    })


    // serieForm est le group gérant les numéros de séries rentrés à la main
    this.serieForm = this.fb.group({
      serie1: ['', []],
    });


    this.disableBTN = false;
    this.compteur = 2;
    this.submitting = false;
    this.produit = this.rmaService.getProduit();
    this.quantite = this.rmaService.getQuantite();
    this.noserieList = this.rmaService.getNoserie();

    this.chargerAide();
    if (this.quantite === 1 && this.noserieList.length > 1) {
      this.quantite = this.noserieList.length;
    }
    if (!this.produit) {
      this.router.navigate(['/espace-client/retours']);
    } else {
      this.chargerAdresse();
      this.chargerForm();
    }
    
    
    this.logFormErrors()
  }


  logFormErrors(): void {
  
    
    Object.keys(this.rmaForm.controls).forEach(key => {
      this.rmaForm.get(key)?.valueChanges.subscribe(() => {
        console.log(`Erreurs pour le champ ${key}:`, this.rmaForm.get(key)?.errors);
      });
    });
  }
  // chargement des adresse du client
  chargerAdresse(): void {
    this.addrData = {
      adressesociete: this.authService.currentUser.name,
      adressenom: this.rmaService.removeAccents(this.produit.livnom),
      adresse1: this.rmaService.removeAccents(this.produit.livadr1),
      adresse2: this.rmaService.removeAccents(this.produit.livadr2),
      codepostal: this.produit.livcodepostal,
      ville: this.rmaService.removeAccents(this.produit.livville),
      paysiso: 'FR',
      pays: 'FRANCE'
    };
  }

  // récupération des informations clients et du formulaire du service rma
  chargerForm(): void {
    this.rmaService.chargerProfil().subscribe(
      data => {
        const form = data;
        this.rmaForm = form;
      }
    );
  }

  ngOnDestroy(): void { // destruction des données afin de ne pas retomber sur la page déjà rempli par erreur
    this.submitting = false;
    //this.rmaService.saveForm(this.rmaForm);
  }

  // en fonction du clic sur certains bouton, il y a redirection
  changerAdresse(): void {
    this.showPopupAdd = true;
    //this.router.navigate(['/espace-client/stats']);
  }

  // appelle les fonctions qui font le lien avec le php
  chargerAide(): void {
    this.rmaService.chargerAideMotif().subscribe(data => {
      this.aideMotif = data;
    });
    this.rmaService.chargerAideAnomalie().subscribe(data => {
      this.aideAnomalie = data;
    });
    this.rmaService.chargerAideSecurite().subscribe(data => {
      this.aideSecurite = data;
    });
  }

  // fonctions qui retourne la chaine de caractère contenant l'aide correspondante
  chargerAideMotif(): string {
    return this.aideMotif;
  }

  chargerAideAnomalie(): string {
    return this.aideAnomalie;
  }

  chargerAideSecurite(): string {
    return this.aideSecurite;
  }

  // permet de revenir sur la page précédente avec le bouton retour
  retourRMA(): void {
    this.router.navigate(['/espace-client/retours']);
  }

  // au clic sur le bouton +, un nouveau champ pour numéro de série apparait dans le form groupe et sur le html
  addSerie(): void {
    if (this.compteur <= this.quantite) { // il ne peut y avoir plus de champ que la quantité total du nb de produit a renvoyer
      const tempNom: any = 'serie' + this.compteur;
      this.serieFormNom.push(tempNom);
      this.serieForm.addControl(tempNom, new FormControl(''));
      this.compteur += 1;
    }
  }

  // appel à la fonction envoiRMA lors du clic sur le bouton submit
  onSubmit(): void {
    this.submitting = true;
    if (this.rmaForm.valid && this.extensionValid) {
      this.envoiRMA();
    }
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file; // Stocke le fichier en tant qu'objet File
    
      
      this.envoiFileName = file.name; // Stocke uniquement le nom du fichier
      this.rmaForm.patchValue({ file: file.name }); // Mettre à jour le formulaire pour affichage
    }
  }
  
  
  envoiRMA(): void {

    // Si un fichier a été sélectionné, on met à jour la variable
    if (this.fileToUpload) {
      this.envoiFile = this.fileToUpload;  // On stocke le fichier
      this.envoiFileName = this.fileToUpload.name;  // Nom du fichier
    } else {
      this.envoiFile = '';  // Si pas de fichier, on passe une chaîne vide
      this.envoiFileName = '';  
    }
  
    // Construction de la liste des numéros de série
    if (this.serieForm.value.serie1 !== '') {
      for (const nom of this.serieFormNom) {
        this.noserieList.push(this.serieForm.value[nom]);
      }
    }
  

    // Désactivation du bouton pour éviter plusieurs envois
    this.disableBTN = true;

    // Appel du service RMA en passant le FormGroup (rmaForm) et le fichier ou chaîne vide
    this.rmaService.envoiRMA(
      this.rmaForm,
      this.envoiFile, // Soit le fichier, soit une chaîne vide
      this.produit,
      this.quantite,
      this.noserieList,
      this.addrData
    ).subscribe((result) => {
      if (result) {
        // En cas de succès, appel des méthodes pour basculer et récapituler
        this.rmaService.bascule();
        this.rmaService.recapitulatif(
          this.rmaForm.value.motif,
          this.rmaForm.value.refRMA,
          this.rmaForm.value.description,
          this.rmaForm.value.IP,
          this.rmaForm.value.login,
          this.rmaForm.value.password.length,
          this.rmaForm.value.mail,
          this.envoiFileName // Le nom du fichier envoyé (si présent)
        );
        // Redirection vers la page de fin de retour
        this.router.navigate(['/espace-client/fin-retour']);
      } else {
        // En cas d'échec, affichage d'une alerte et redirection vers la page retours
        this.window.alert('Demande de RMA refusée');
        this.router.navigate(['/espace-client/retours']);
      }
    });
  }

  hide(): void {
    this.showPopup = false;
    this.rmaForm.setValue({
    serie: this.rmaForm.value.serie ?? '',
    motif: '',
    refRMA: this.rmaForm.value.refRMA ?? '',
    description: this.rmaForm.value.description ?? '',
    login: this.rmaForm.value.login ?? '',
    password: this.rmaForm.value.password ?? '',
    IP: this.rmaForm.value.IP ?? '',
    nom: this.rmaForm.value.nom ?? '',
    mail: this.rmaForm.value.mail ?? '',
    tel: this.rmaForm.value.tel ?? '',
    cgv: this.rmaForm.value.cgv ?? '',
    file: this.rmaForm.value.file ?? ''
    });
  }

  verifMotif() {
    if (this.produit.savconst === 'O') {
      this.showPopup = true;
    }
  }

  // redirection vers le site constructeur en fonction de l'url
  redirectionConstructeur(): void {
    const url = this.produit.savurl;
    if (url !== '') {
      this.window.open(url);
      this.router.navigate(['/']);

    }
  }

  boolChange(event) {
    this.showPopupAdd = event;
  }

  addChange(event) {
    this.addrData = {
      adressesociete: this.authService.currentUser.name,
      adressenom: this.rmaService.removeAccents(event.nom),
      adresse1: this.rmaService.removeAccents(event.adresse1),
      adresse2: this.rmaService.removeAccents(event.adresse2),
      codepostal: event.codepostal,
      ville: this.rmaService.removeAccents(event.ville),
      paysiso: event.paysiso,
      pays: event.pays
    };
  }
}
