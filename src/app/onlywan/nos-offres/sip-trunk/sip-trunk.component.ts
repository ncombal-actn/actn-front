import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '@env';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sip-trunk',
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
