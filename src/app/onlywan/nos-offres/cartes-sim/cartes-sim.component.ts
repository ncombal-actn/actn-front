import { Component } from '@angular/core';
import { environment } from '@env';
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-cartes-sim',
  standalone: true,
  imports: [
    TitleWLineComponent
  ],
  templateUrl: './cartes-sim.component.html',
  styleUrls: ['./cartes-sim.component.scss']
})
export class CartesSimComponent {
  environment = environment
}
