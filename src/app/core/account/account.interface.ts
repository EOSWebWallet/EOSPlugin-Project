import { IKeypair } from '../keypair/keypair.interface';
import { INetwork, INetworkAccount } from '../network/network.interface';

export class IAccount {
  name: string;
  keypair: IKeypair;
  network: INetwork;
  accounts: INetworkAccount[];
}
