import AES from 'aes-oop';
import * as Eos from 'eosjs';

import { IKeypair } from './keypair.interface';

const { ecc } = Eos.modules;

export class KeypairUtils {

  static isEncrypted(keypair: IKeypair): boolean {
    return keypair.privateKey.length > 51;
  }

  static encrypt(keypair: IKeypair, seed: string): any {
    return  {
      ...keypair,
      privateKey: KeypairUtils.isEncrypted(keypair)
        ? keypair.privateKey
        : AES.encrypt(keypair.privateKey, seed)
    };
  }

  static decrypt(keypairData: any, seed: string): IKeypair {
    return {
      ...keypairData,
      privateKey: KeypairUtils.isEncrypted(keypairData)
        ? AES.decrypt(keypairData.privateKey, seed)
        : keypairData.privateKey
    };
  }

  static validPrivateKey(privateKey: string): boolean {
    return ecc.isValidPrivate(privateKey);
  }

  static privateToPublic(privateKey: string): string {
    return ecc.privateToPublic(privateKey);
  }

  static makePublicKey(keypair: IKeypair): Promise<IKeypair> {
    return new Promise(resolve => resolve({
      privateKey: keypair.privateKey,
      publicKey: keypair.privateKey.length > 50 && KeypairUtils.validPrivateKey(keypair.privateKey)
        ? KeypairUtils.privateToPublic(keypair.privateKey)
        : ''
    }));
  }

  static generateKeyPair(): Promise<IKeypair> {
    return new Promise(resolve => {
      ecc.randomKey().then(privateKey => {
        const publicKey = ecc.privateToPublic(privateKey);
        if (ecc.isValidPublic(publicKey) && ecc.isValidPrivate(privateKey)) {
          resolve({
            publicKey,
            privateKey
          });
        }
      });
    });
  }
}
