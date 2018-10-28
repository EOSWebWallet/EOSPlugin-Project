import Eos from 'eosjs';

import { INetwork } from './network.interface';

export class Networks {
  static NETWORK_PREFIX = 'Network';

  static fromJson(json: any): INetwork {
    return { ...json };
  }

  static createNetwork(): INetwork {
    return {
      protocol: 'https',
    };
  }

  static isValid(network: INetwork): boolean {
    return network.host.length && !!network.port;
  }

  static fullhost(network: INetwork): string {
    return `${network.protocol}://${network.host}${network.port ? ':' : ''}${network.port}`;
  }
}
