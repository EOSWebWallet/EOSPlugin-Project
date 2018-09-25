import { IAccountFields } from './account.interface';
import { NetworkUtils } from '../network/network.utils';

export const PersonalFields = {
  firstname: 'firstname',
  lastname: 'lastname',
  email: 'email',
  birthdate: 'birthdate'
};

export const LocationFields = {
  phone: 'phone',
  address: 'address',
  city: 'city',
  state: 'state',
  country: 'country',
  zipcode: 'zipcode'
};

export const AccountFields = {
  blockchain: 'blockchain',
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
    if (!fields.personal.every(field => Object.keys(PersonalFields).includes(field))) {
      return false;
    }
    if (!fields.location.every(field => Object.keys(LocationFields).includes(field))) {
      return false;
    }
    if (fields.accounts.length && !fields.accounts.every(network => network.isValid())) {
      return false;
    }
    return true;
  }

  static createEmptyFields(): IAccountFields {
    return  {
      accounts: [],
      personal: [],
      location: []
    };
  }
}
