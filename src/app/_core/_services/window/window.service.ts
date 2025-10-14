import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
function _window(): any {
  // Return the global native browser window object
  return window;
}
@Injectable({
  providedIn: 'root'
})
export class WindowService  {
  public location = this.isBrowser() ? window.location : undefined;
  public document = this.isBrowser() ? window.document : undefined;
  public history = this.isBrowser() ? window.history : undefined;
  //public window = this.isBrowser() ? window : undefined;
  public platformId: any;
  get window(): any {
    if(this.isBrowser()){
      return _window();
    }
  }
  public get innerWidth(): number {
    return this.isBrowser() ? window.innerWidth : undefined;
  }

  public get length(): number {
    return this.isBrowser() ? window.length : undefined;
  }

  public get scrollY(): number {
    return this.isBrowser() ? window.scrollY : undefined;
  }

  public get pageYOffset(): number {
    return this.isBrowser() ? window.pageYOffset : undefined;
  }

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.platformId = platformId;
  }


  public scroll(x: number, y: number): void {
    if (this.isBrowser()) {
      window.scroll(x, y);
    }
  }
  public open(url: string, target?: string, features?: string): Window | null {
    return this.isBrowser() ? window.open(url, target, features) : null;
  }

  public reload(){
    if (this.isBrowser()) {
      window.location.reload();
    }
  }

  public scrollTo(x: number, y: number): void {
    if (this.isBrowser()) {
      window.scrollTo({ top: y, left: x, behavior: 'smooth' });
    }
  }
  public alert(message?: any): void {
    if (this.isBrowser()) {
      window.alert(message);
    }
  }

  public setTimeout(handler: TimerHandler, timeout?: number): number {
    return this.isBrowser() ? window.setTimeout(handler, timeout) : undefined;
  }

  public setInterval(handler: TimerHandler, timeout?: number): number {
    return this.isBrowser() ? window.setInterval(handler, timeout) : undefined;
  }

  public clearTimeout(handle?: number): void {
    if (this.isBrowser()) {
      window.clearTimeout(handle);
    }
  }

  public isBrowser(): boolean {
    return this.platformId && isPlatformBrowser(this.platformId);
  }

  public clearInterval(handle?: number): void {
    if (this.isBrowser()) {
      window.clearInterval(handle);
    }
  }

  public taMereLaPute() {
    if(this.isBrowser()){
      return /Mozilla/i.test(window.navigator.userAgent);
    }
  }

  public tonPereLeGigolo(message: any){
    if(this.isBrowser()){
      //return window.addEventListener('message', message, false);
    }
  }

  public scrollToElement(selector: string, offsetDesktop: number, offsetMobile: number): void {
    if (this.isBrowser()) {
      const element = window.document.querySelector(selector);
      if (element) {
        const offset = window.innerWidth > 750 ? offsetDesktop : offsetMobile;
        window.scrollTo({ behavior: 'smooth', top: window.scrollY + element.getBoundingClientRect().top - offset });
      }
    }
  }

  public getBoundingClientRect(element: any): DOMRect {
    if (this.isBrowser() && element) {
      return element.getBoundingClientRect();
    }
    return null;
  }

  public scrollToElementWithOffset(selector: string, offset: number): void {
    if (this.isBrowser()) {
      const element = window.document.querySelector(selector);
      if (element) {
        window.scrollTo({ behavior: 'smooth', top: window.scrollY + element.getBoundingClientRect().top - offset });
      }
    }
  }

  public isElementOverflowing(selector1: any, selector2: any): boolean {
    if (this.isBrowser()) {
      const element1 = window.document.querySelector(selector1) as HTMLElement;
      const element2 = window.document.querySelector(selector2) as HTMLElement;
      if (element1 && element2) {
        return element1.getBoundingClientRect().bottom > element2.getBoundingClientRect().top;
      }
    }
    return false;
  }

  public historyZbi(){
    if(this.isBrowser()){
      return window.history;
    }
  }

  public getElementById(string:string){
    if(this.isBrowser()){
      return window.document.getElementById(string);
    }
  }
}
