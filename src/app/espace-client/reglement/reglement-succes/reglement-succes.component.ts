import { Component, OnInit } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-reglement-succes',
  standalone: true,
  templateUrl: './reglement-succes.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./reglement-succes.component.scss']
})
export class ReglementSuccesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
