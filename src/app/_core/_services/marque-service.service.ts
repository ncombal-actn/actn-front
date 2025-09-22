import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarqueServiceService {

  private _marquePicked = new BehaviorSubject<string>('');
  marquePicked$ = this._marquePicked.asObservable();

  private _indexMarquePicked = new BehaviorSubject<number>(-1);
  indexMarquePicked$ = this._indexMarquePicked.asObservable();

  setMarquePicked(marque: string) {
    this._marquePicked.next(marque);
  }

  setIndexMarquePicked(index: number) {
    this._indexMarquePicked.next(index);
  }
  getIndexMarquePicked(){
    return this._indexMarquePicked.getValue();
  }
  getMarquePicked(){
    return this._marquePicked.getValue();
  }

}
