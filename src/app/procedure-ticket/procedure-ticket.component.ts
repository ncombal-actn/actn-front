import { UtilModule } from '@/_util/util.module';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-procedure-ticket',
  templateUrl: './procedure-ticket.component.html',
  styleUrl: './procedure-ticket.component.scss',
  standalone: true,
 imports: [UtilModule] 
})
export class ProcedureTicketComponent implements OnInit {

  constructor(){}

  ngOnInit(){

  }
}
