import Eos from 'eosjs';

import { IAccount } from './account.interface';
import { INetwork } from '../network/network.interface';

export class AccountUtils {

  static fromJson(json: any): IAccount {
    return {
      ...json
    };
  }

  static getKeyAccounts(host: string, port: number, publicKey: string): Promise<any> {
    return Eos({ httpEndpoint: `https://${host}:${port}` }).getKeyAccounts(publicKey);
  }
}
