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

export interface INetworkAccountInfo {
  netPercent?: number;
  cpuPercent?: number;
  ramPercent?: number;
  netData?: string;
  cpuData?: string;
  unstaked?: number;
  staked?: number;
  totalBalance?: number;
  usdTotal?: number;
  cpuUsedSec?: number;
  cpuMaxSec?: number;
  netUsedKb?: number;
  netMaxKb?: number;
  ramUsedKb?: number;
  ramMaxKb?: number;
}

export interface INetworkAccountAction {
  [key: string]: string;
}
