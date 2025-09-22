/* import { Injectable } from '@angular/core';
import { CookieService } from '../cookie.service';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService implements Storage {

    private _UXforbiddenItems = ['ActnCalogueFormat', 'searchHistory']

    constructor(
        protected cookieService: CookieService
    ) {
        this.clearForbiddenItems();
    }

    [name: string]: any;
    //length: number;

    clear(): void {
        localStorage.clear();
    }

    clearForbiddenItems(): void {
        if (this.cookieService.get('cookie_consent_ux') !== 'ACCEPT') {
            for (const key of this._UXforbiddenItems) {
                localStorage.removeItem(key);
            }
        }
    }

    getItem(key: string): string {
        if (this._UXforbiddenItems.includes(key)) {
            return this.cookieService.get('cookie_consent_ux') === 'ACCEPT' ? localStorage.getItem(key) : '';
        } else {
            return localStorage.getItem(key);
        }
    }

    key(index: number): string {
        return localStorage.key(index);
    }

    removeItem(key: string): void {
        return localStorage.removeItem(key);
    }

    setItem(key: string, value: string): void {
        if (this._UXforbiddenItems.includes(key)) {
            if (this.cookieService.get('cookie_consent_ux') === 'ACCEPT') {
                localStorage.setItem(key, value);
            }
        } else {
            localStorage.setItem(key, value);
        }
    }

  readonly length: number;
}
 */
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {CookieService} from '../cookie.service';
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements Storage {

  platformId: Object;
  private _UXforbiddenItems = ['ActnCalogueFormat', 'searchHistory'];

  constructor(
    protected cookieService: CookieService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
    this.clearForbiddenItems();
  }

  [name: string]: any;

  //length: number;

  get length(): number {
    if (this.isLocalStorageAvailable() && isPlatformBrowser(this.platformId)) {
      return localStorage.length;
    } else {
      return 0;
    }
  }

  clear(): void {
    if (this.isLocalStorageAvailable() && isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }

  clearForbiddenItems(): void {
    if (this.isLocalStorageAvailable() && this.cookieService.get('cookie_consent_ux') !== 'ACCEPT' && isPlatformBrowser(this.platformId)) {
      for (const key of this._UXforbiddenItems) {
        localStorage.removeItem(key);
      }
    }
  }

  // Implement other Storage interface methods with similar guards
   // Get item from localStorage
   getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        return null;
      }
    } else {
      return null;
    }
  }

  // Set item in localStorage
  setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {

        localStorage.setItem(key, value);

      } catch (error) {
        console.error('Error setting localStorage:', error);
      }
    }
  }

  // Remove item from localStorage
  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing localStorage item:', error);
      }
    }
  }

  key(index: number): string | null {
    if (this.isLocalStorageAvailable() && isPlatformBrowser(this.platformId)) {
      return localStorage.key(index);
    } else {
      return null;
    }
  }

  private isLocalStorageAvailable(): boolean {
    if (typeof localStorage === 'undefined' && isPlatformBrowser(this.platformId)) {
      return false;
    }
    try {
      const test = '__localStorageTest__';
      if(isPlatformBrowser(this.platformId)){
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
