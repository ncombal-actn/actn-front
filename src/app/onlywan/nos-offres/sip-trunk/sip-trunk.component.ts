import { Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { environment } from '@env';
import {MatCard} from "@angular/material/card";
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-sip-trunk',
  standalone: true,
  imports: [
    TitleWLineComponent,
    MatCard
  ],
  templateUrl: './sip-trunk.component.html',
  styleUrls: ['./sip-trunk.component.scss']
})
export class SipTrunkComponent implements OnInit {
  environment = environment
  sipTrunkHTML: SafeHtml = null;
  constructor(

  ) { }

  ngOnInit(): void {
  }



}
