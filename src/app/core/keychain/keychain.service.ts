import { IKeypair } from '../keypair/keypair.interface';
import { IKeychain } from './keychain.interface';

import { KeypairService } from '../keypair/keypair.service';

export class KeychainService {

  static fromJson(json: any): IKeychain {
    return {
      keypairs: (json.keypairs || []).map(x => KeypairService.fromJson(x))
    };
  }
}
