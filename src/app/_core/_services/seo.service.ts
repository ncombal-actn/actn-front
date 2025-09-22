import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

declare let gtag: Function; // Google Analytics function
@Injectable({
  providedIn: 'root'
})
export class SeoService {

  
  constructor(
    private meta: Meta,
    private titleService: Title) {

  }

  logEvent(eventName: string, eventParams: any = {}) {
    gtag('event', eventName, eventParams);
  }
  
  public setMetaDescription(content: string) {

    this.meta.updateTag(
      {
        name: 'description',
        content: content
      });
  }

  setUserId(userId: string) {
    gtag('set', {
      'user_id': userId 
    });
  }

  setPage(path:string) {
    gtag('config', 'GT-K5MHHR', {
      'page_path': path
    });
  }

  public setMetaTitle(title:string) {

    this.titleService.setTitle(title);

  }

}