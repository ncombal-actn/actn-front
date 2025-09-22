import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env';
import { Observable, Subject } from 'rxjs';
import { Tree, Categorie } from '@/_util/models';
import { CatalogueService, UserService, WindowService } from '@core/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newsletters',
  templateUrl: './newsletters.component.html',
  styleUrls: ['./newsletters.component.scss']
})
export class NewslettersComponent implements OnInit {

  // permet de bloquer le submit si des champs obligatoires ne sont pas remplis
  submitting = false;

  // charge la structure du catalogue produit, et donc les categories
  structureCatalogue: Observable<Tree<Categorie>>;

  // charge l'environnement
  environment = environment;

  // informations de l'utilisateur courant
  mailClient: string;
  nomClient: string;
  telClient: string;


  
  newsForm:FormGroup;
  constructor(
    private fb: FormBuilder,
    private catalogueService: CatalogueService,
    private router: Router,
    private userService: UserService,
    private window: WindowService
  ) { 

   
  }

  ngOnInit() {
    this.newsForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(40)]],
      mail: ['', [Validators.required, Validators.maxLength(70), Validators.email]],
      tel: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^[0-9+_-]+$/)]],
      newsACTN: ['', []],
      newsAutre: ['', []],
      desinscription: ['', []],
      categories: [[], []],
    });
    this.submitting = false;
    this.structureCatalogue = this.catalogueService.getStructure();
    this.chargerProfil().subscribe(() => {
      this.newsForm.setValue({
        nom: this.nomClient,
        mail: this.mailClient,
        tel: this.telClient,
        newsACTN: '',
        newsAutre: '',
        desinscription: '',
        categories: null,
      });
    });
  }

  // lors de la validation du form envoi au fichier php. Pour l'instant il est pas fait donc affichage du form
  onSubmit(): void {
    this.submitting = true;
    if (this.newsForm.valid) {
      this.envoiNews();
    }
  }

  // lien avec le service d'envoi des donnees, en attente du php
  envoiNews(): void {
    this.userService.envoiNews(this.newsForm).subscribe((result) => {
      if (result) {
        this.router.navigate(['/']);
      } else {
        this.window.alert('Vos changements n\'ont pas été pris en compte');
        this.router.navigate(['/']);
      }
    });
  }

  // fonction appelé lors du clic sur une categorie, permet de les ajouter dans la liste des favoris
  catToggle(option: string): void {
    const categories = this.newsForm.get(['categories']);
    if (!!categories.value.find((_option: string) => _option === option)) {
      categories.setValue(categories.value.filter((v: string) => v !== option));
    } else {
      categories.setValue(categories.value.concat(option));
    }
  }

  // chargement des informations clients
  chargerProfil(): Subject<void> {
    const attente = new Subject<void>();
    this.userService.getProfil().subscribe(
      data => {
        this.nomClient = data.user.TIERSIND.trim();
        this.mailClient = data.user.TIERSMEL.trim();
        this.telClient = data.user.TIERSTEL.trim();
        attente.next();
        attente.complete();
      },
      err => { },
      () => { }
    );
    return attente;
  }

}
