import { IKeypair } from '../keypair/keypair.interface';
import { IKeychain } from './keychain.interface';

import { AccountUtils } from '../account/account.utils';

export class KeychainUtils {

  static fromJson(json: any): IKeychain {
    return {
      accounts: (json.accounts || []).map(x => AccountUtils.fromJson(x))
    };
  }
}
