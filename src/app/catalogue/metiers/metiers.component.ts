import {Component, OnInit} from '@angular/core';
import {environment} from '@env';
import {CatalogueService} from '@core/_services';

import {take} from 'rxjs/operators';
import {KeyValue, KeyValuePipe} from '@angular/common';
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-metiers',
  standalone: true,
  imports: [
    TitleWLineComponent,
    RouterLink,
    KeyValuePipe
  ],
  templateUrl: './metiers.component.html',
  styleUrls: ['./metiers.component.scss']
})
export class MetiersComponent implements OnInit {

  environment = environment;
  Categories: [] = [];
  // categories: Array<[string, string]>;
  type = "";

  public isReady = false;
  public categories = new Map<string, { marque: string, marquelib: string }[]>();

  public categorie = new Map<string, { code: string, sequence: string }>();

  public compareFn(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
    //return +this.categorie.get(a.key).sequence - +this.categorie.get(b.key).sequence;
    const aValue = this.categorie.get(a.key);
    const bValue = this.categorie.get(b.key);
    return (aValue ? +aValue.sequence : 0) - (bValue ? +bValue.sequence : 0);
  }

  constructor(private catalogueService: CatalogueService) {
  }

  ngOnInit(): void {

    this.catalogueService.getCategoriesMarque()
      .pipe(take(1))
      .subscribe(
        (ret: any[]) => {
          Object.values(ret).forEach(categorie => {
            if (categorie['niv1'] != 'FOR') {
              if (this.categories.get(categorie['niv1lib'])) {
                this.categories.set(categorie['niv1lib'], [...(this.categories.get(categorie['niv1lib']) || []), {
                  marque: categorie['marque'],
                  marquelib: categorie['marquelib']
                }]);
              } else {
                this.categories.set(categorie['niv1lib'], [{
                  marque: categorie['marque'],
                  marquelib: categorie['marquelib']
                }]);
                this.categorie.set(categorie['niv1lib'], {code: categorie['niv1'], sequence: categorie['sequence']});
              }
            }

          });

          this.isReady = true;
        }
      );

  }

}
