import { Component, OnInit, Input } from '@angular/core';
import { Produit } from '@/_util/models/produit';
import { environment } from '@env';

@Component({
  selector: 'app-pdf-icon',
  templateUrl: './pdf-icon.component.html',
  styleUrls: ['./pdf-icon.component.scss']
})
export class PdfIconComponent implements OnInit {

  @Input() readonly produit: Produit = null;
  @Input() showLibelle = true;
  @Input() urlStart: string = environment.produitPdfUrl;

  environment = environment;

  constructor() { }

  ngOnInit(): void { }

}
