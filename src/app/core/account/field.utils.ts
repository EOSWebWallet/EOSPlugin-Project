import { IAccountFields } from './account.interface';
import { NetworkUtils } from '../network/network.utils';

export const AccountFields = {
  network: 'network'
};

export const IdentityBaseFields = {
  account: 'accounts'
};

export class AccountRequiredFields {

  static fromJson(json: any): IAccountFields {
    return {
      ...json,
      accounts: json.hasOwnProperty('accounts')
        ? json.accounts.map(NetworkUtils.fromJson)
        : []
    };
  }

  static isValid(fields: IAccountFields): boolean {
    if (JSON.stringify(Object.keys(AccountRequiredFields.createEmptyFields())) !== JSON.stringify(Object.keys(fields))) {
      return false;
    }
    if (fields.accounts.length && !fields.accounts.every(network => NetworkUtils.isValid(network))) {
      return false;
    }
    return true;
  }

  static createEmptyFields(): IAccountFields {
    return {
      accounts: [],
    };
  }
}
