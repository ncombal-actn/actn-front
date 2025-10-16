import { Component } from '@angular/core';
import { environment } from '@env';
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-hebergement-web',
  imports: [
    TitleWLineComponent
  ],
  templateUrl: './hebergement-web.component.html',
  standalone: true,
  styleUrls: ['./hebergement-web.component.scss']
})
export class HebergementWebComponent  {
  environment = environment;


}
