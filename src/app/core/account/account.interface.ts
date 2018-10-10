import { IKeypair } from '../keypair/keypair.interface';
import { INetwork, INetworkAccount } from '../network/network.interface';

export interface IAccount {
  name: string;
  keypair: IKeypair;
  network: INetwork;
  accounts: INetworkAccount[];
}

export interface IAccountIdentity {
  name: string;
  publicKey: string;
  accounts: INetworkAccountIdentity[];
}

export interface INetworkAccountIdentity {
  name: string;
  authority: string;
  blockchain: string;
}
