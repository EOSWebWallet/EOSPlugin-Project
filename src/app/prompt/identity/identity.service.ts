import { Injectable } from '@angular/core';
import { IAccount } from '../../core/account/account.interface';
import { INetworkAccount } from '../../core/network/network.interface';
import { IAccountIdentity } from './identity.interface';

@Injectable()
export class IdentityPromptService {

  getAccountIdentity(account: IAccount, networkAccount: INetworkAccount): IAccountIdentity {
    return {
      publicKey: account.keypair.publicKey,
      account: networkAccount
    };
  }
}
