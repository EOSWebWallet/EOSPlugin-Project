import { INetwork } from './network.interface';

export class NetworkUtils {

  static fromJson(json: any): INetwork {
    return { ...json };
  }

  static createNetwork(): INetwork {
    return {
      name: 'New Network',
      host: 'newnetwork.url',
      port: 443
    };
  }
}
