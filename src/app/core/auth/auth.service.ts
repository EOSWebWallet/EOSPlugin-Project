import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { map, flatMap } from 'rxjs/operators';

import { IEncryptedPassword } from './auth.interface';
import { IdGenerator } from '../encrypt/id.generator';

import { EncryptService } from '../encrypt/encrypt.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class AuthService implements CanActivate {

  constructor(
    private router: Router,
    private encryptService: EncryptService,
    private storageService: StorageService,
  ) {
    this.router.navigate([ '/registration' ]);
  }

  canActivate(): Observable<boolean> {
    return of(true);
  }

  register(password: string): Observable<IEncryptedPassword> {
    return this.storageService.setSalt(this.encryptService.insecureHash(IdGenerator.text(32)))
      .pipe(
        flatMap(() => this.createEncryptedPassword(password))
      );
  }

  private createEncryptedPassword(password: string): Observable<IEncryptedPassword> {
    return this.encryptService.createMnemonic(password)
      .pipe(
        map(([mnemonic, seed]) => ({ mnemonic, seed }))
      );
  }
}
