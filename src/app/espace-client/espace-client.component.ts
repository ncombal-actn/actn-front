import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-espace-client',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './espace-client.component.html',
  styleUrls: ['./espace-client.component.scss']
})
export class EspaceClientComponent  {

  constructor() {}
}
