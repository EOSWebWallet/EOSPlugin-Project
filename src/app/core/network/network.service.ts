import { INetwork } from './network.interface';

export class NetworkService {

  static fromJson(json: any): INetwork {
    return { ...json };
  }
}
