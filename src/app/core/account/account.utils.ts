import { IAccount } from './account.interface';

export class AccountUtils {

  static fromJson(json: any): IAccount {
    return {
      ...json
    };
  }
}
