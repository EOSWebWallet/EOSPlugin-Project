import { INetwork } from './network.interface';

export class NetworkUtils {
  static NETWORK_PREFIX = 'Network';

  static fromJson(json: any): INetwork {
    return { ...json };
  }

  static createNetwork(name: string): INetwork {
    return {
      name,
      host: 'network.host',
      port: 443
    };
  }
}
