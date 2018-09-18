import { ISettings } from './settings.interface';

import { NetworkUtils } from '../network/network.utils';

export class SettingsUtils {

  static fromJson(json: any): ISettings {
    return {
      networks: json.networks
        ? json.networks.map(x => NetworkUtils.fromJson(x))
        : []
    };
  }
}
