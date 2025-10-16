import { Component, OnInit } from '@angular/core';
import {CategorieComponent} from "@/catalogue/categorie/categorie.component";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    CategorieComponent
  ],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
