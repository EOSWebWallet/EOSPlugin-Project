import { ISettings } from './settings.interface';

import { NetworkService } from '../network/network.service';

export class SettingsService {

  static fromJson(json: any): ISettings {
    return {
      networks: json.networks
        ? json.networks.map(x => NetworkService.fromJson(x))
        : []
    };
  }
}
