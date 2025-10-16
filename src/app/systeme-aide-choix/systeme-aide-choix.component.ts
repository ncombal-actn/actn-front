import {Produit} from '@/_util/models';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '@core/_services';
import {environment} from '@env';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {faChevronUp, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {ProduitsComponent} from "@/_util/components/produits/produits.component";
import {AsyncPipe, CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {BanniereComponent} from "@/banniere/banniere.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatFormField} from "@angular/material/form-field";
import {ImgFallbackDirective} from "@/_util/directives/img-fallback.directive";

@Component({
  selector: 'app-systeme-aide-choix',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    ProduitsComponent,
    BanniereComponent,
    FaIconComponent,
    TitleWLineComponent,
    MatFormField,
    MatIcon,
    MatOption,
    MatSelect,
    ImgFallbackDirective
  ],
  templateUrl: './systeme-aide-choix.component.html',
  styleUrls: ['./systeme-aide-choix.component.scss']
})
export class SystemeAideChoixComponent implements OnInit {

  filtresForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
  }

  listMarque = [];
  listMarqueCode = [];
  listCategorie = [];
  listNomCom = [];
  listNomSubCom = [];
  environment = environment;
  marqueActive = {
    code: '',
    libelle: '',
    photo: ''
  };
  cat1Active = {
    code: '',
    libelle: '',
    photo: ''
  };
  cat2Active = {
    code: '',
    libelle: '',
    photo: ''
  };
  cat3Active = {
    code: '',
    libelle: '',
    photo: ''
  };
  nomComActive: any = {
    libelle: '',
    photo: '',
  };
  nomSubComActive: any = {
    libelle: '',
    photo: '',
  };
  txtComActive = '';
  txtSubComActive = '';
  imageComActive = '';
  imageSubComActive = '';
  chipsFiltre = [];
  showMarque = true;
  showCat = true;
  showFiltreCom = true;
  showFiltreSubCom = true;
  showFiltre = true;
  passage = false;
  noProduit = false;
  source1: any;
  source2: any;
  mapCat = new Map();
  mapFiltreCom = new Map();
  numProduits = [];
  filtres: Array<{
    label: string,
    num: string,
    options: { value: string; count: number }[];
  }> = [];

  legendeGamme = new Array<{ order: number; couleur: string; libelle: string; }>();
  legendeSelectionne = '';

  searched = false;
  loading = false;
  produits$ = new BehaviorSubject<Produit[]>([]);

  get produits(): Array<Produit> {
    return this.produits$.value;
  }

  set produits(value: Array<Produit>) {
    this.produits$.next(value);
  }

  private _restart$ = new Subject<void>();

  ngOnInit(): void {
    this.filtresForm = this.fb.group({});

    this.userService.getCategories().subscribe(ret => {
      this.source1 = ret;

      // Fonction récursive pour construire l'arbre Marque > Niv1 > Niv2 > Niv3
      const setNiveau = (arrayDeMarque: Array<{
        libelle: string,
        code: string,
        photo: string;
      }>, map: Map<string, any>) => {
        if (arrayDeMarque.length > 0) {
          map.set(arrayDeMarque[0].code, {
            libelle: arrayDeMarque[0]['libelle'],
            photo: arrayDeMarque[0]['photo'],
            map: setNiveau(
              arrayDeMarque.slice(1),
              map.has(arrayDeMarque[0].code) ? map.get(arrayDeMarque[0].code)['map'] : new Map()
            )
          });
        }
        return map;
      };

      this.source1.forEach(element => {
        this.mapCat = setNiveau([
          {libelle: element.marquelibelle, code: element.marque, photo: element.marquelibelle},
          {libelle: element.libelleniv1, code: element.NIV1, photo: element.photoniv1},
          {libelle: element.libelleniv2, code: element.NIV2, photo: element.photoniv2},
          {libelle: element.libelleniv3, code: element.NIV3, photo: element.photoniv3}
        ], this.mapCat);
      });

      this.listCategorie = [];
      for (const [key, value] of this.mapCat) {
        this.listMarque.push({
          code: key,
          libelle: value.libelle,
          photo: value.photo
        });
      }
      this.listMarque.sort((element1, element2) => element1.code.localeCompare(element2.code));
      this.listMarqueCode = Array.from(this.mapCat.keys());

      if (this.route.snapshot.params.marque) {
        const index = this.listMarque.findIndex(e => e.code === this.route.snapshot.params.marque);
        if (index !== -1) {
          this.toggleMarque(this.listMarque[index]);
        }
      }
    });
  }

  toggleMarque(marque) {
    if (this.marqueActive.libelle === marque.libelle) {
      this.marqueActive = {
        code: '',
        libelle: '',
        photo: ''
      };
      this.deselectFiltreCom();
      this.deselectSubCom();
      this.deselectFiltre();
      this.legendeSelectionne = '';
    } else {
      this.marqueActive = marque;
      for (const [key, value] of this.mapCat.get(marque.code).map) {
        this.listCategorie.push({
          code: key,
          libelle: value.libelle,
          photo: value.photo
        });
      }
      this.showMarque = false;
      this.deselectFiltreCom();
      this.deselectSubCom();
      this.deselectFiltre();
      this.getFiltreCom();
    }
  }

  toggleCat(categorie) {
    switch (categorie.code) {
      case this.cat1Active.code: {
        this.cat1Active = {
          code: '',
          libelle: '',
          photo: ''
        };
        this.cat2Active = {
          code: '',
          libelle: '',
          photo: ''
        };
        this.cat3Active = {
          code: '',
          libelle: '',
          photo: ''
        };
        break;
      }
      case this.cat2Active.code: {
        this.cat2Active = {
          code: '',
          libelle: '',
          photo: ''
        };
        this.cat3Active = {
          code: '',
          libelle: '',
          photo: ''
        };
        break;
      }
      case this.cat3Active.code: {
        this.cat3Active = {
          code: '',
          libelle: '',
          photo: ''
        };
        break;
      }
      default: {
        if (this.cat1Active.code) {
          if (this.cat2Active.code) {
            this.cat3Active = categorie;
            this.showCat = false;
            this.listCategorie = [];
            this.getFiltreCom();
          } else {
            this.listCategorie = [];
            this.cat2Active = categorie;
            const temp = this.mapCat.get(this.marqueActive.code).map.get(this.cat1Active.code).map.get(this.cat2Active.code).map.keys();
            const tempValueLib = this.mapCat.get(this.marqueActive.code).map.get(this.cat1Active.code).map.get(this.cat2Active.code).map.values();
            const tempValuePho = this.mapCat.get(this.marqueActive.code).map.get(this.cat1Active.code).map.get(this.cat2Active.code).map.values();
            const tempBool = this.mapCat.get(this.marqueActive.code).map.get(this.cat1Active.code).map.get(this.cat2Active.code).map.keys();
            while (!tempBool.next().done) {
              this.listCategorie.push({
                code: temp.next().value,
                libelle: tempValueLib.next().value.libelle,
                photo: tempValuePho.next().value.photo
              });
            }
            if (this.listCategorie.length === 0) {
              this.showCat = false;
              this.getFiltreCom();
            }
          }
        } else {
          this.listCategorie = [];
          this.cat1Active = categorie;
          const temp = this.mapCat.get(this.marqueActive.code).map.get(this.cat1Active.code).map.keys();
          const tempValueLib = this.mapCat.get(this.marqueActive.code).map.get(this.cat1Active.code).map.values();
          const tempValuePho = this.mapCat.get(this.marqueActive.code).map.get(this.cat1Active.code).map.values();
          const tempBool = this.mapCat.get(this.marqueActive.code).map.get(this.cat1Active.code).map.keys();
          while (!tempBool.next().done) {
            this.listCategorie.push({
              code: temp.next().value,
              libelle: tempValueLib.next().value.libelle,
              photo: tempValuePho.next().value.photo
            });
          }
          if (this.listCategorie.length === 0) {
            this.showCat = false;
            this.getFiltreCom();
          }
        }
      }
    }
  }

  openMarque() {
    if (this.showMarque && this.marqueActive.code) {
      this.showMarque = false;
    } else {
      this.showMarque = true;
      this.deselectCat();
    }
  }

  openCat() {
    this.showCat = true;
    this.listCategorie = [];
    const temp = this.mapCat.get(this.marqueActive.code).map.keys();
    const tempValueLib = this.mapCat.get(this.marqueActive.code).map.values();
    const tempValuePho = this.mapCat.get(this.marqueActive.code).map.values();
    const tempBool = this.mapCat.get(this.marqueActive.code).map.keys();
    while (!tempBool.next().done) {
      this.listCategorie.push({
        code: temp.next().value,
        libelle: tempValueLib.next().value.libelle,
        photo: tempValuePho.next().value.photo
      });
    }
  }

  deselectCat() {
    this.showCat = true;
    this.cat1Active = {
      code: '',
      libelle: '',
      photo: ''
    };
    this.cat2Active = {
      code: '',
      libelle: '',
      photo: ''
    };
    this.cat3Active = {
      code: '',
      libelle: '',
      photo: ''
    };
    this.listCategorie = [];
  }

  deselectFiltreCom() {
    this.passage = false;
    this.showFiltreCom = true;
    this.listNomCom = [];
    this.nomComActive = {
      libelle: '',
      photo: ''
    };
    this.txtComActive = '';
    this.imageComActive = '';
  }

  getFiltreCom() {
    this.legendeGamme = [];
    this.listNomCom = [];
    this.mapFiltreCom = new Map();
    this.userService.getFiltres(this.marqueActive.code).subscribe(ret => {
      this.source2 = ret;
      this.source2.forEach(element => {
        if (this.mapFiltreCom.has(element.val01)) {
          if (element.val02) {
            this.mapFiltreCom.get(element.val01).subcat.set(element.val02, {
              photo: element.val02photo,
              sequence: +element.sequence,
              color: element.couleur,
              lib: element.couleurlib
            });
          }
        } else {
          this.mapFiltreCom.set(element.val01, {
            photo: element.val01photo,
            sequence: +element.sequence,
            color: element.couleur,
            lib: element.couleurlib,
            subcat: new Map()
          });
          if (element.val02) {
            this.mapFiltreCom.get(element.val01).subcat.set(element.val02, {
              photo: element.val02photo,
              sequence: +element.sequence,
              color: element.couleur,
              lib: element.couleurlib
            });
          }
        }
      });
      this.mapFiltreCom.delete(''); // remove empty element
      const seqSet = new Map<number, { order: number, couleur: string, libelle: string }>();
      for (const [key, value] of this.mapFiltreCom) {
        const description = {texte: '', image: ''};
        this.getDescription(key, this.marqueActive.code)
          .pipe(take(1))
          .subscribe(texte => {
            description.texte = texte.replace(/https*:[^ ]*/g, '');
            description.image = new RegExp(/https*:[^ ]*/g).exec(texte)?.[0];
          });
        seqSet.set(value.lib, {order: value.sequence, couleur: value.color, libelle: value.lib});
        this.listNomCom.push({
          libelle: key,
          photo: value.photo,
          sequence: value.sequence,
          couleur: value.color,
          couleurlib: value.lib,
          description
        });
      }
      this.legendeGamme = Array.from(seqSet).sort((s1, s2) => s1[1]['order'] - s2[1]['order']).map(seq => seq[1]);
      this.legendeGamme = this.legendeGamme.filter(
        (elem) => {
          return (!!elem.libelle);
        }
      );
      this.listNomCom.sort((el1, el2) => el1.sequence - el2.sequence);
    });
  }

  openFiltreCom() {
    if (this.showFiltreCom && this.nomComActive.libelle) {
      this.showFiltreCom = false;
    } else {
      this.showFiltreCom = true;
    }
  }

  getDescription(niveau: string, nom: string): Observable<string> {
    return this.userService.getTxtDescription(niveau, nom);
  }

  toggleFiltreCom(gamme) {
    if (this.nomComActive.libelle === gamme.libelle) {
      this.passage = false;
      this.nomComActive = {
        libelle: '',
        photo: ''
      };
      this.txtComActive = '';
      this.imageComActive = '';
    } else {
      this.txtComActive = '';
      this.imageComActive = '';
      this.nomComActive = gamme;
      this.showFiltreCom = false;
      this.deselectSubCom();
      this.getSubCom();
    }
  }

  deselectSubCom() {
    this.showFiltreSubCom = true;
    this.listNomSubCom = [];
    this.nomSubComActive = {
      libelle: '',
      photo: ''
    };
    this.txtSubComActive = '';
    this.imageSubComActive = '';
  }

  getSubCom() {
    this.passage = false;
    this.listNomSubCom = [];
    for (const [key, value] of this.mapFiltreCom.get(this.nomComActive.libelle).subcat) {
      const description = {texte: '', image: ''};
      const photo = {name: '', exists: false};
      this.getDescription(key, this.marqueActive.code)
        .pipe(take(1))
        .subscribe(texte => {
          description.texte = texte.replace(/https*:[^ ]*/g, '');
          description.image = new RegExp(/https*:[^ ]*/g).exec(texte)?.[0];
        });
      this.userService.checkFileExists(`aidechoix/${this.marqueActive.code}-${key}.webp`)
        .pipe(take(1))
        .subscribe(fileExists => {
          photo.name = value;
          photo.exists = fileExists;
        });
      this.listNomSubCom.push({
        libelle: key,
        photo,
        description
      });
    }
    this.deselectFiltre();
    if (this.listNomSubCom.length > 0) {
      this.listNomSubCom.sort((el1, el2) => el1.libelle.localeCompare(el2.libelle));
    } else {
      this.passage = true;
      this.deselectFiltre();
      this.getFiltres();
    }
  }

  openFiltreSubCom() {
    if (this.showFiltreSubCom && this.nomSubComActive.libelle) {
      this.showFiltreSubCom = false;
    } else {
      this.showFiltreSubCom = true;
    }
  }

  toggleFiltreSubCom(gamme) {
    if (this.nomSubComActive.libelle === gamme.libelle) {
      this.nomSubComActive = {
        libelle: '',
        photo: ''
      };
      this.txtSubComActive = '';
      this.imageSubComActive = '';
    } else {
      this.txtSubComActive = '';
      this.imageSubComActive = '';
      this.passage = true;
      this.nomSubComActive = gamme;
      this.userService.getTxtDescription(gamme.libelle, this.marqueActive.code).subscribe(ret => {
          const retArray = ret.split(/[\r\n]+/g);
          const ele = retArray.pop();
          if (ele.includes('http')) {
            this.imageSubComActive = ele;
            this.txtSubComActive = retArray.join('');
          } else {
            this.txtSubComActive = ret;
          }
        },
        err => {
          this.txtSubComActive = '';
          this.imageSubComActive = '';
        });
      this.showFiltreSubCom = false;
      this.deselectFiltre();
      this.getFiltres();
    }
  }

  getFiltres() {
    this.showFiltre = true;
    this.chipsFiltre = [];
    this.filtres = [];
    this._restart$.next();
    this.filtresForm = this.fb.group({});
    const ligne2 = this.source2.filter(element => element.val01 === this.nomComActive.libelle && element.val02 === this.nomSubComActive.libelle);
    const ligne1 = this.source1.filter(element => element.marque === this.marqueActive.code && element.NIV1 === ligne2[0].NIV1 && element.NIV2 === ligne2[0].NIV2 && element.NIV3 === ligne2[0].NIV3);
    for (let i = 3; i < 21; i++) {
      let iter: string;
      if (i < 10) {
        iter = '0' + i;
      } else {
        iter = i + '';
      }
      const crit = ligne1[0][`critere${iter}`];
      if (crit) {
        this.filtres.push({
          label: crit,
          num: iter,
          options: []
        });
      }
    }
    for (const filtre of this.filtres) {
      const control = this.fb.control('', []);
      control.valueChanges.pipe(takeUntil(this._restart$)).subscribe(() => {
        setTimeout(() => {
          this.filtres.forEach(_filtre => {
            const produits = this.source2.filter(element => {
              if (element.val01 !== this.nomComActive.libelle) {
                return false;
              }
              if (element.val02 !== this.nomSubComActive.libelle) {
                return false;
              }
              for (const filtre2 of this.filtres) {
                if (filtre2.num !== _filtre.num) {
                  const filtreValue = this.filtresForm.value[`${filtre2.label}`];
                  if (filtreValue) {
                    const val = element[`val${filtre2.num}`];
                    const valArray = val.split(',');
                    const array2 = [];
                    valArray.forEach(element2 => {
                      array2.push(element2.trim());
                    });
                    if (!array2.some(val => filtreValue.includes(val)) && filtreValue.length > 0) {
                      return false;
                    }
                  }
                }
              }
              return true;
            });
            _filtre.options = _filtre.options.map(option => {
              return {value: option.value, count: this.countFiltreValue(produits, _filtre.num, option.value)};
            });
          });
        });
      });
      this.filtresForm.addControl(filtre.label as string, control);
    }
    this.filtres.forEach(filtre => {
      const set = new Set();
      ligne2.forEach(element => {
        const val = element[`val${filtre.num}`];
        const valArray = val.split(',');
        if (val) {
          if (valArray) {
            valArray.forEach(element3 => {
              set.add(element3.trim());
            });
          } else {
            set.add(val);
          }
        }
      });
      filtre.options = Array.from(set).map((el: string) => {
        return {value: el, count: this.countFiltreValue(this.filterProduit(), filtre.num, el)}
      }).sort((e1, e2) => e1.value.localeCompare(e2.value));
    });
    this.filtres.forEach(element => {
      if (element.options.length === 1) {
        this.filtresForm.get(element.label).setValue([element.options[0].value]);
      }
    });
    this.filtresForm.updateValueAndValidity();
    this.showFiltreCom = false;
    this.searched = false;
  }

  /**
   * Filtre les produits selon les valeurs actuelles de filtres.
   * @returns La liste des produits filtrés
   */
  filterProduit(): any[] {
    return this.source2.filter(element => {
      if (element.val01 !== this.nomComActive.libelle) {
        return false;
      }
      if (element.val02 !== this.nomSubComActive.libelle) {
        return false;
      }
      for (const filtre of this.filtres) {
        const filtreValue = this.filtresForm.value[`${filtre.label}`];
        if (filtreValue) {
          const val = element[`val${filtre.num}`];
          const valArray = val.split(',');
          const array2 = [];
          valArray.forEach(element2 => {
            array2.push(element2.trim());
          });
          if (!array2.some(val => filtreValue.includes(val)) && filtreValue.length > 0) {
            return false;
          }
        }
      }
      return true;
    });
  }

  /**
   * Indique le nombre de produits dont la valeur i contient une certaine valeur.
   * @param produits Une liste de produits
   * @param i Le numéro de la valeur à vérifier
   * @param value La valeur à vérifier
   * @returns Un nombre
   */
  countFiltreValue(produits: unknown[], i: string, value: string): number {
    if (value.length === 0) {
      return produits.length;
    }
    return produits.filter(produit => produit[`val${i}`].split(',').some((v: string) => v.trim() === value)).length;
  }

  deselectFiltre() {
    this.filtres = [];
    this.showFiltre = true;
    this.chipsFiltre = [];
    this.numProduits = [];
    this.produits = [];
    this.noProduit = false;
  }

  openFiltre() {
    if (this.produits.length > 0 && this.showFiltre) {
      this.showFiltre = false;
    } else {
      this.showFiltre = true;
    }
  }

  toggleFiltre() {
    this.chipsFiltre = [];
    this.numProduits = [];
    this.noProduit = false;
    this.showFiltre = false;
    this.loading = true;
    this.searched = true;
    for (const filtre of this.filtres) {
      if (this.filtresForm.value[`${filtre.label}`]) {
        for (const val of this.filtresForm.value[`${filtre.label}`]) {
          this.chipsFiltre.push({
            label: filtre.label,
            value: val
          });
        }
      }
    }
    const lignes = this.filterProduit();
    lignes.forEach(element => {
      this.numProduits.push(element.produit);
    });
    if (this.numProduits.length === 0) {
      this.noProduit = true;
    }
    this.userService.getProduits(this.numProduits).subscribe(ret => {
      if (ret) {

        this.produits = ret.sort((p1, p2) => +p1.prix - +p2.prix);
      }

      this.loading = false;
    });
  }

  removeFiltre(chips) {
    const tabl = this.filtresForm.value[`${chips.label}`];
    tabl.splice(this.filtresForm.value[`${chips.label}`].indexOf(chips.value), 1);
    if (tabl.length > 0) {
      this.filtresForm.get(chips.label).setValue(tabl);
    } else {
      this.filtresForm.get(chips.label).setValue('');
    }
    this.chipsFiltre.splice(this.chipsFiltre.indexOf(chips), 1);
    this.filtresForm.updateValueAndValidity();
    if (!this.showFiltre) {
      this.toggleFiltre();
    }
  }

  removeAllFiltre() {
    for (const filtre of this.filtres) {
      this.filtresForm.get(filtre.label).setValue('');
    }
    this.chipsFiltre = [];
    this.filtresForm.updateValueAndValidity();
    this.toggleFiltre();
    this.openFiltre();
    //this.getFiltres();
  }

  removeNomCom() {
    this.toggleFiltreCom(this.nomComActive);
    this.openFiltreCom();
    this.produits = [];
    this.numProduits = [];
    this.noProduit = false;
  }

  removeNomSubCom() {
    this.toggleFiltreSubCom(this.nomSubComActive);
    this.openFiltreSubCom();
    this.produits = [];
    this.noProduit = false;
    this.numProduits = [];
  }

  removeMarque() {
    this.toggleMarque(this.marqueActive);
    this.openMarque();
    this.produits = [];
    this.noProduit = false;
    this.numProduits = [];
    this.legendeSelectionne = '';
  }

  protected readonly faChevronUp = faChevronUp;
  protected readonly faTimesCircle = faTimesCircle;
}
