import { IKeypair } from '../keypair/keypair.interface';
import { INetwork, INetworkAccount } from '../network/network.interface';

export interface IAccount {
  id?: string;
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
  blockchain: 'eos';
  name: string;
  authority: string;
}
