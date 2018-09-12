import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { IBrowserStorage } from './storage.interface';

import { BrowserAPIService } from '../browser/browser.service';

@Injectable()
export class StorageService {
  private static KEY_SALT = 'salt';

  private storage: IBrowserStorage;

  constructor(
    private browserAPIService: BrowserAPIService
  ) {
    this.initStorage();
  }

  save(key: string, value: any): Observable<any> {
    return Observable.create(o => {
      this.storage.set({ [key]: value }, () => {
        o.next(value);
        o.complete();
      });
    });
  }

  get(key: string): Observable<any> {
    return Observable.create(o => {
      this.storage.get(key, result => {
        o.next(result[key]);
        o.complete();
      });
    });
  }

  getSalt(): Observable<string> {
    return Observable.create(o => {
      this.storage.get(StorageService.KEY_SALT, ({ salt }) => {
        o.next(salt);
        o.complete();
      });
    });
  }

  setSalt(salt: string): Observable<void> {
    return Observable.create(o => {
      this.storage.set({ [StorageService.KEY_SALT]: salt }, () => {
        o.next();
        o.complete();
      });
    });
  }

  private initStorage(): void {
    if (this.browserAPIService.browserAPI && this.browserAPIService.browserAPI.storage) {
      this.storage = this.browserAPIService.browserAPI.storage.local;
    } else {
      this.storage = {
        set: (value, cb) => Object.keys(value).map(key => {
          localStorage.setItem(key, JSON.stringify(value[key]));
          cb();
        }),
        get: (key, cb) => cb({ [key]: JSON.parse(localStorage.getItem(key)) })
      };
    }
  }
}
