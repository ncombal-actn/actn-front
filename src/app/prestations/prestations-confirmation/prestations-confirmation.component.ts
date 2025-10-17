import { Component, OnInit } from '@angular/core';
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-prestations-confirmation',
  standalone: true,
  imports: [
    TitleWLineComponent
  ],
  templateUrl: './prestations-confirmation.component.html',
  styleUrls: ['./prestations-confirmation.component.scss'],
})
export class PrestationsConfirmationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
