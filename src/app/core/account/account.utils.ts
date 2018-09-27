import Eos from 'eosjs';

import { IAccount, IAccountFields } from './account.interface';
import { INetwork } from '../network/network.interface';
import { NotificationUtils } from '../notification/notification.utils';
import { PromptType } from '../notification/notification.interface';
import { NetworkUtils } from '../network/network.utils';

export class AccountUtils {

  static fromJson(json: any): IAccount {
    return {
      ...json
    };
  }

  static getKeyAccounts(protocol: string, host: string, port: number, publicKey: string): Promise<any> {
    return Eos({ httpEndpoint: `${protocol}://${host}:${port}` }).getKeyAccounts(publicKey);
  }

  static getIdentity(domain: string, requirements: IAccountFields, callback: Function): Promise<void> {
    return NotificationUtils.open({
      type: PromptType.REQUEST_IDENTITY,
      domain,
      requirements,
      responder: identity => {
        if (!identity || identity.hasOwnProperty('isError')) {
            callback(null, null);
            return false;
        }
        callback(identity);
      }
    });
  }

  static networkedAccount(account: IAccount, network: INetwork): any {
    return account.accounts[ NetworkUtils.unique(network) ];
  }
}
