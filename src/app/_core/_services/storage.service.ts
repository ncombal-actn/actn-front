import { Injectable, PLATFORM_ID, inject, Injector } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { User } from '@/_util/models';
import { take } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storages = new Map<string, Storage<any>>();
  private platformId = inject(PLATFORM_ID);
  private isServer = isPlatformServer(this.platformId);

  private authService: AuthenticationService | null = null;

  constructor(private injector: Injector) {}

  /** ✅ Lazy getter — la clé pour casser le cycle */
  private get authenticationService(): AuthenticationService {
    if (!this.authService) {
      this.authService = this.injector.get(AuthenticationService);
    }
    return this.authService;
  }

  public getStoredData<T>(
    storageKey: string,
    key: string,
    fetchFunction: () => Observable<T>,
    invalidOnUserChange = true
  ): Observable<T> {
    if (this.isServer) {
      return fetchFunction().pipe(take(1));
    }

    const ret = new Subject<T>();
    const storage = this.getStorage<T>(storageKey);

    if (invalidOnUserChange && this.authenticationService.currentUser?.id !== storage.user?.id) {
      this.clearStorage(storageKey);
    }

    const cachedValue = storage.data.get(key);

    if (cachedValue == null) {
      storage.user = this.authenticationService.currentUser;
      fetchFunction().pipe(take(1)).subscribe(value => {
        storage.data.set(key, value);
        setTimeout(() => {
          ret.next(value);
          ret.complete();
        });
      });
    } else {
      setTimeout(() => {
        ret.next(cachedValue);
        ret.complete();
      });
    }

    return ret.asObservable();
  }

  public clearStorage(storageKey: string): void {
    this._storages.get(storageKey)?.data.clear();
  }

  private getStorage<T>(storageKey: string): Storage<T> {
    let storage = this._storages.get(storageKey);
    if (storage == null) {
      this._storages.set(storageKey, new Storage(new Map<string, T>()));
      storage = this._storages.get(storageKey)!;
      storage.user = this.authenticationService.currentUser;
    }
    return storage;
  }

  setStoredData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

class Storage<T> {
  data: Map<string, T>;
  user: User;

  constructor(data: Map<string, T>) {
    this.data = data;
    this.user = new User();
    this.user.id = -1;
  }
}
