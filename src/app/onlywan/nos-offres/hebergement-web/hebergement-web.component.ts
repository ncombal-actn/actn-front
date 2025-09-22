import { Component } from '@angular/core';
import { environment } from '@env';

@Component({
  selector: 'app-hebergement-web',
  templateUrl: './hebergement-web.component.html',
  styleUrls: ['./hebergement-web.component.scss']
})
export class HebergementWebComponent  {
  environment = environment;


}
