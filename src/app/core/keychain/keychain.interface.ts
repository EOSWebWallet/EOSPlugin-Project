import { IKeypair } from '../keypair/keypair.interface';
import { IAccount } from '../account/account.interface';

export interface IKeychain {
  accounts: IAccount[];
}
