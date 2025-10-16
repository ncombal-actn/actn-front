import { Component, OnInit } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-document-manquant',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './document-manquant.component.html',
  styleUrls: ['./document-manquant.component.scss']
})
export class DocumentManquantComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
