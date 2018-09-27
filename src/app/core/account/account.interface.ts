import { IKeypair } from '../keypair/keypair.interface';
import { INetwork, INetworkAccount } from '../network/network.interface';

export interface IAccount {
  name: string;
  keypair: IKeypair;
  network: INetwork;
  accounts: INetworkAccount[];
}

export interface IAccountFields {
  accounts: INetwork[];
}
