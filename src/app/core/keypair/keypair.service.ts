import AES from 'aes-oop';

import { IKeypair } from './keypair.interface';

export class KeypairService {

  static fromJson(json: any): IKeypair {
    return { ...json };
  }

  static isEncrypted(keypair: IKeypair): boolean {
    return keypair.privateKey.length > 51;
  }

  static encrypt(keypair: IKeypair, seed: string): any {
    return  {
      ...keypair,
      privateKey: KeypairService.isEncrypted(keypair)
        ? keypair.privateKey
        : AES.encrypt(keypair.privateKey, seed)
    };
  }

  static decrypt(keypairData: any, seed: string): IKeypair {
    return {
      ...keypairData,
      privateKey: KeypairService.isEncrypted(keypairData)
        ? AES.decrypt(keypairData.privateKey, seed)
        : keypairData.privateKey
    };
  }
}
