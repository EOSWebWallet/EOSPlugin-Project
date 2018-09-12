import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { entropyToMnemonic, generateMnemonic, mnemonicToSeedHex } from 'bip39';
import * as scrypt from 'scrypt-async';
import { first, map } from 'rxjs/operators';

import { StorageService } from '../storage/storage.service';

declare var ecc: any;

@Injectable()
export class EncryptService {

  constructor(
    private storageService: StorageService
  ) { }

  insecureHash(cleartext): string {
    return ecc.sha256(cleartext);
  }

  secureHash(cleartext): Observable<string> {
    return Observable.create(o => {
      this.storageService.getSalt().subscribe(salt => {
        scrypt(cleartext, salt, {
          N: 16384,
          r: 8,
          p: 1,
          dkLen: 16,
          encoding: 'hex'
        }, (derivedKey) => {
          o.next(derivedKey);
          o.complete();
        });
      });
    });
  }

  createMnemonic(password): Observable<string[]> {
    return this.secureHash(password)
      .pipe(
        map(hash => entropyToMnemonic(hash as string)),
        map(mnemonic => [ mnemonic, mnemonicToSeedHex(mnemonic) ])
      );
  }

  mnemonicToSeed(mnemonic): string {
    return mnemonicToSeedHex(mnemonic);
  }

  generateDanglingMnemonic(): string[] {
    const mnemonic = generateMnemonic();
    return [ mnemonic, mnemonicToSeedHex(mnemonic) ];
  }
}
