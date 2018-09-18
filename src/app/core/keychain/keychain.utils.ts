import { IKeypair } from '../keypair/keypair.interface';
import { IKeychain } from './keychain.interface';

import { KeypairUtils } from '../keypair/keypair.utils';

export class KeychainUtils {

  static fromJson(json: any): IKeychain {
    return {
      keypairs: (json.keypairs || []).map(x => KeypairUtils.fromJson(x))
    };
  }
}
