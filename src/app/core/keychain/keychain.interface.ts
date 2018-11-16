import { IKeypair } from '../keypair/keypair.interface';
import { IAccount } from '../account/account.interface';
import { IUIState } from '../ui/state.interface';

export interface IKeychain {
  accounts: IAccount[];
  state: IUIState;
}
