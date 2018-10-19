import { entropyToMnemonic, generateMnemonic, mnemonicToSeedHex } from 'bip39';
import * as scrypt from 'scrypt-async';

import { PluginStorage } from '../storage/storage';

declare var eosjs_ecc: any;

export class Encryption {

  static insecureHash(cleartext): string {
    return eosjs_ecc.sha256(cleartext);
  }

  static async secureHash(cleartext): Promise<any> {
    return new Promise(async resolve => {
      const salt = await PluginStorage.getSalt();
      scrypt(cleartext, salt, {
          N: 16384,
          r: 8,
          p: 1,
          dkLen: 16,
          encoding: 'hex'
      }, (derivedKey) => {
          resolve(derivedKey);
      });
    });
  }

  static async generateMnemonic(password): Promise<string[]> {
    const hash = await Encryption.secureHash(password);
    const mnemonic = entropyToMnemonic(hash);
    return [ mnemonic, mnemonicToSeedHex(mnemonic) ];
  }

  static mnemonicToSeed(mnemonic): string {
    return mnemonicToSeedHex(mnemonic);
  }

  static generateDanglingMnemonic(): string[] {
    const mnemonic = generateMnemonic();
    return [ mnemonic, mnemonicToSeedHex(mnemonic) ];
  }

  static rand(): number {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0] / (0xffffffff + 1);
  }

  static text(size): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < size; i++) {
      text += possible.charAt(Math.floor(Encryption.rand() * possible.length));
    }
    return text;
  }

  static numeric(size): string {
    const add = 1;
    let max = 12 - add;

    if ( size > max ) {
      return Encryption.numeric(max) + Encryption.numeric(size - max);
    }

    max = Math.pow(10, size + add);
    const min = max / 10,
          number = Math.floor(Encryption.rand() * (max - min + 1)) + min;

    return ('' + number).substring(add);
  }
}
