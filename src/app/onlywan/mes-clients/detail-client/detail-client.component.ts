import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env';
import {MatCard} from "@angular/material/card";
import {TitleWLineComponent} from "@/_util/components/title-w-line/title-w-line.component";

@Component({
  selector: 'app-detail-client',
  standalone: true,
  imports: [
    TitleWLineComponent,
    MatCard
  ],
  templateUrl: './detail-client.component.html',
  styleUrls: ['./detail-client.component.scss']
})
export class DetailClientComponent  implements OnInit{

client:any={};
id:string;
clientForm:FormGroup;
rdy= false;
noClients = false;

constructor(public http: HttpClient, public router: ActivatedRoute, public fb: FormBuilder){

}


  ngOnInit(): void {
    this.id =  this.router.snapshot.params['id'];
    this.clientForm = this.fb.group({
      clientreference: new FormControl ({value:'',disabled:true}),
      numeroligne: new FormControl ({value:'',disabled:true}),
      clientadresse: new FormControl ({value:'',disabled:true}),
      clientcodepostal: new FormControl ({value:'',disabled:true}),
      clientville: new FormControl ({value:'',disabled:true}),
      clienttel: new FormControl ({value:'',disabled:true}),
      revendeurnom: new FormControl ({value:'',disabled:true}),
      revendeurmail: new FormControl ({value:'',disabled:true}),
      telephoneContact: new FormControl ({value:'',disabled:true}),
      numsecours: new FormControl ({value:'',disabled:true}),
      services: new FormControl ({value:'',disabled:true}),
      ippublique: new FormControl({value:'',disabled:true})
    });





    this.http.get<any[]>(`${environment.apiUrl}clientOnlywanMaj.php`, {
      withCredentials: true,
      responseType: 'json',
      params:{
        mode: 'SEL',
       // client: ref
      }
    }).subscribe(
      data => {

        data.forEach(client =>{
          if(client.numero === this.id){
            this.client = client;
            this.noClients =false
          }else{

           // this.noClients = true;
          }

        })

        this.clientForm.patchValue({
          clientreference: this.client.reference,
          numeroligne: this.client.numeroligne,
          clientadresse:this.client.clientadresse,
          clientcodepostal:this.client.clientcodepostal,
          clientville:this.client.clientville,
          clienttel:this.client.clienttel,
          revendeurnom:this.client.revendeurnom,
          revendeurmail:this.client.revendeurmail,
          telephoneContact:this.client.revendeurtel,
          numsecours:this.client.numsecours,
          services:this.client.services,
          ippublique:this.client.ippublique,
        })

      })
    }

}
