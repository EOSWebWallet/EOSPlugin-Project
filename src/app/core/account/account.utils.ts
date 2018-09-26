import Eos from 'eosjs';

import { IAccount } from './account.interface';
import { INetwork } from '../network/network.interface';
import { NotificationUrils } from '../notification/notification.utils';
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

  static getIdentity(callback: Function): Promise<void> {
    return NotificationUrils.open({
      type: PromptType.REQUEST_IDENTITY,
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
