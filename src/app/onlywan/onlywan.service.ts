import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnlywanService {

  constructor() { }


}

export interface OnlywanClient {
  abodebut:string
  abofin:string
  client:string
  clientnom:string
  commentaire:string
  dateportabiliteclient:string
  devis:string
  heureportabiliteclient:string
  ippublique:string
  login:string
  mdp:string
  numsecours:string
  revendeurmail:string
  rio:string
  services:string
  site:string
  statut:string
}
