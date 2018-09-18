import { IKeypair } from '../keypair/keypair.interface';
import { INetwork, INetworkAccount } from '../network/network.interface';

export class IAccount {
  keypair: IKeypair;
  network: INetwork;
  accounts: INetworkAccount[];
}
