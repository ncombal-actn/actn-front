import { Component, ElementRef, ViewChild } from '@angular/core';
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-test-eligibilite',
  standalone: true,
  imports: [
    TitleWLineComponent
  ],
  templateUrl: './test-eligibilite.component.html',
  styleUrls: ['./test-eligibilite.component.scss']
})
export class TestEligibiliteComponent {

  @ViewChild('testEligibilite') iframe: ElementRef;

  constructor(){}

}
