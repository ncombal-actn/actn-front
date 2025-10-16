import { Component } from '@angular/core';
import { environment } from '@env';
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-cloud-pbx-centrex',
  standalone: true,
  imports: [
    TitleWLineComponent
  ],
  templateUrl: './cloud-pbx-centrex.component.html',
  styleUrls: ['./cloud-pbx-centrex.component.scss']
})
export class CloudPbxCentrexComponent {

  environment = environment



}
