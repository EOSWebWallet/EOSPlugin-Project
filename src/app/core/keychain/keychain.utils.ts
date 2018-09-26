import { IKeypair } from '../keypair/keypair.interface';
import { IKeychain } from './keychain.interface';

import { AccountUtils } from '../account/account.utils';
import { PermissionUtils } from '../permission/permission.utils';
import { IAccount } from '../account/account.interface';

export class KeychainUtils {

  static fromJson(json: any): IKeychain {
    return {
      accounts: (json.accounts || []).map(x => AccountUtils.fromJson(x)),
      permissions: (json.permissions || []).map(p => PermissionUtils.fromJson(p))
    };
  }

  static findIdentity(keychain: IKeychain, publicKey: string): IAccount {
    return keychain.accounts.find(a => a.keypair.publicKey === publicKey);
  }

  static findIdentityFromDomain(keychain: IKeychain, domain: string): IAccount {
    const idFromPermissions = keychain.permissions
      .find(permission => PermissionUtils.isIdentityOnly(permission) && permission.domain === domain);
    return idFromPermissions
      ? KeychainUtils.findIdentity(keychain, idFromPermissions.identity)
      : null;
  }
}
