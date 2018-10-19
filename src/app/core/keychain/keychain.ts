import { IKeypair } from '../keypair/keypair.interface';
import { IKeychain } from './keychain.interface';
import { IAccount } from '../account/account.interface';

import { Accounts } from '../account/account';

export class Keychains {

  static fromJson(json: any): IKeychain {
    return {
      accounts: (json.accounts || []).map(x => Accounts.fromJson(x)),
    };
  }
}
