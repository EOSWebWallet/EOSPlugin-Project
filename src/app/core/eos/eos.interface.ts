import { IPlugin } from '../plugin/plugin.interface';
import { IAccountIdentity } from '../account/account.interface';

export interface ISigner {
  requestSignature: (signargs: any) => void;
}

export interface ISignatureOptions {
  plugin: IPlugin;
  payload: any;
}

export interface ISignatureResult {
  signatures: any[];
}

export interface IChainInfo {
  chainId: string;
}

export interface INetworkAccountInfo {
  netPercent?: number;
  cpuPercent?: number;
  ramPercent?: number;
  netData?: string;
  cpuData?: string;
  unstaked?: number;
  usdUnstaked?: number;
  staked?: number;
  usdStaked?: number;
  totalBalance?: number;
  usdTotal?: number;
  cpuUsedSec?: number;
  cpuMaxSec?: number;
  netUsedKb?: number;
  netMaxKb?: number;
  ramUsedKb?: number;
  ramMaxKb?: number;
  tokenString?: string;
}

export interface INetworkAccountAction {
  from: string;
  to: string;
  quantity: string;
  symbol: string;
  date: string;
  direction?: string;
}

export const Tokens: string[][] = [
  ['eosadddddddd','ADD'],
  ['eosatidiumio','ATD'],
  ['eosblackteam','BLACK'],
  ['eosiochaince','CET'],
  ['challengedac','CHL'],
  ['ednazztokens','EDNA'],
  ['eosio.token','EOS'],
  ['eosdactokens','EOSDAC'],
  ['eoxeoxeoxeox','EOX'],
  ['oo1122334455','OS'],
  ['everipediaiq','IQ'],
  ['therealkarma','KARMA'],
  ['octtothemoon','OCT'],
  ['poormantoken','POOR'],
  ['wizznetwork1','WIZZ'],
  ['zkstokensr4u','ZKS'],
  ['publytoken11','PUB']
]

export enum NetworkChaindId {
  MainNet = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  Jungle = '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
}
