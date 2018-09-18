import AES from 'aes-oop';

import { IKeypair } from './keypair.interface';

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
}
