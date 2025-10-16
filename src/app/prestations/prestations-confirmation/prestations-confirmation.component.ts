import { Component, OnInit } from '@angular/core';
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-prestations-confirmation',
  templateUrl: './prestations-confirmation.component.html',
  styleUrls: ['./prestations-confirmation.component.scss'],
  standalone: true,
  imports: [
    TitleWLineComponent
  ]
})
export class PrestationsConfirmationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
