import Eos from 'eosjs';

import { IAccount, IAccountIdentity, INetworkAccountIdentity } from './account.interface';
import { INetwork, INetworkAccount } from '../network/network.interface';
import { PromptUtils } from '../prompt/prompt.utils';
import { PromptType, IIdentityPromtOptions } from '../prompt/prompt.interface';
import { NetworkUtils } from '../network/network.utils';

export class AccountUtils {

  static fromJson(json: any): IAccount {
    return {
      accounts: [],
      ...json
    };
  }

  static getKeyAccounts(protocol: string, host: string, port: number, publicKey: string): Promise<any> {
      return new Promise((resolve, reject) => {
        const eos = Eos({ httpEndpoint: `${protocol}://${host}:${port}` });
        eos.getKeyAccounts(publicKey).then(res => {
          if (!res || !res.hasOwnProperty('account_names')) {
            resolve([]);
            return false;
          }

          Promise.all(
            res.account_names
              .map(name => eos.getAccount(name).catch(e => resolve([])))
          ).then(multires => {
            const accounts = [];
            multires.map(account => {
              (<any>account).permissions.map(permission => {
                accounts.push({ name: (<any>account).account_name, authority: permission.perm_name });
              });
            });
            resolve(accounts);
          }).catch(e => resolve([]));
        }).catch(e => resolve([]));
    });
  }

  static getInfo(protocol: string, host: string, port: number, accountName: string): Promise<any> {
    return new Eos({ httpEndpoint: `${protocol}://${host}:${port}` }).getAccount(accountName);
  }

  static getActions(protocol: string, host: string, port: number, accountName: string): Promise<any> {
    return new Eos({ httpEndpoint: `${protocol}://${host}:${port}` }).getActions(accountName, undefined, -150000);
  }

  static getIdentity(accounts: IAccount[], callback: Function): Promise<void> {
    return PromptUtils.open({
      type: PromptType.REQUEST_IDENTITY,
      accounts,
      responder: identity => {
        if (!identity || identity.hasOwnProperty('isError')) {
            callback(null);
            return false;
        }
        callback(identity);
      }
    } as IIdentityPromtOptions);
  }

  static createAccountIdentity(account: IAccount, networkAccount: INetworkAccount): IAccountIdentity {
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

  static filterAccountsByNetwork(accounts: IAccount[], network: INetwork): IAccount[] {
    return accounts.filter(a => a.network.host === network.host && a.network.port === network.port);
  }

  static getAccount(identity: IAccountIdentity, accounts: IAccount[]): IAccount {
    return accounts.find(a =>
      a.name === identity.name
        && a.keypair.publicKey === identity.publicKey
        && !!a.accounts.find(na => !!identity.accounts.find(ia => ia.name === na.name && ia.authority === na.authority))
    );
  }

  static getNetworkAccount(identity: INetworkAccountIdentity, account: IAccount): INetworkAccount {
    return account.accounts.find(a => a.name === identity.name && a.authority === identity.authority);
  }
}
