import { INetwork } from './network.interface';

export class NetworkUtils {
  static NETWORK_PREFIX = 'Network';

  static fromJson(json: any): INetwork {
    return { ...json };
  }

  static createNetwork(name: string): INetwork {
    return {
      name,
      protocol: 'https',
      host: 'network.host',
      port: 443
    };
  }

  static isValid(network: INetwork): boolean {
    return network.host.length && !!network.port;
  }

  static fullhost(network: INetwork): string {
    return `${network.protocol}://${network.host}${network.port ? ':' : ''}${network.port}`;
  }
}
