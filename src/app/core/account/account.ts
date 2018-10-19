import Eos from 'eosjs';

import { IAccount, IAccountIdentity, INetworkAccountIdentity } from './account.interface';
import { INetwork, INetworkAccount } from '../network/network.interface';
import { Prompts } from '../prompt/prompt';
import { PromptType, IIdentityPromtOptions } from '../prompt/prompt.interface';

export class Accounts {

  static fromJson(json: any): IAccount {
    return {
      accounts: [],
      ...json
    };
  }

  static requestIdentity(network: INetwork, callback: Function): Promise<void> {
    return Prompts.open({
      type: PromptType.REQUEST_IDENTITY,
      network,
      responder: identity => {
        if (!identity || identity.hasOwnProperty('isError')) {
            callback(null);
            return false;
        }
        callback(identity);
      }
    } as IIdentityPromtOptions);
  }

  static createIdentity(account: IAccount, networkAccount: INetworkAccount): IAccountIdentity {
    return {
      name: account.name,
      publicKey: account.keypair.publicKey,
      accounts: [ {
        blockchain: 'eos',
        name: networkAccount.name,
        authority: networkAccount.authority
      } ]
    };
  }

  static findAccounts(network: INetwork, accounts: IAccount[]): IAccount[] {
    return accounts.filter(a => a.network.host === network.host && a.network.port === network.port);
  }

  static findAccount(identity: IAccountIdentity, accounts: IAccount[]): IAccount {
    return accounts.find(a =>
      a.name === identity.name
        && a.keypair.publicKey === identity.publicKey
        && !!a.accounts.find(na => !!identity.accounts.find(ia => ia.name === na.name && ia.authority === na.authority))
    );
  }

  static findNetworkAccount(identity: INetworkAccountIdentity, account: IAccount): INetworkAccount {
    return account.accounts.find(a => a.name === identity.name && a.authority === identity.authority);
  }
}
