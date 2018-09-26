import { IPermission } from './permission.interface';
import { NetworkUtils } from '../network/network.utils';

export class PermissionUtils {

  static fromJson(json): IPermission {
    return {
      ...json,
      network: json.network
        ? NetworkUtils.fromJson(json.network)
        : json.network
    };
  }

  static isIdentityOnly(permission: IPermission): boolean {
    return !permission.contract && !permission.action;
  }
}
