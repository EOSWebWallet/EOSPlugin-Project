import { IKeypair } from '../keypair/keypair.interface';
import { IAccount } from '../account/account.interface';
import { IPermission } from '../permission/permission.interface';

export interface IKeychain {
  accounts: IAccount[];
  permissions: IPermission[];
}
