import { Component, OnInit } from '@angular/core';
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-videosurveillance-confirmation',
  standalone: true,
  imports: [
    TitleWLineComponent
  ],
  templateUrl: './videosurveillance-confirmation.component.html',
  styleUrls: ['./videosurveillance-confirmation.component.scss']
})
export class VideosurveillanceConfirmationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
