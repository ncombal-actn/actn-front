import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SAVService {

  constructor(public http:HttpClient) { }

  getProcedure(name: string):Observable<any> {
    return this.http.get(`${environment.apiUrl}/procedureSav.php`,{
      params: {marque: name}
    })

  }
}