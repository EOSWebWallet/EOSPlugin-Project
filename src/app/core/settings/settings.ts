import { ISettings } from './settings.interface';

import { Networks } from '../network/network';

export class Settings {

  static fromJson(json: any): ISettings {
    return {
      networks: json.networks
        ? json.networks.map(x => Networks.fromJson(x))
        : []
    };
  }
}
