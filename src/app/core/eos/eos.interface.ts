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
}

export interface INetworkAccountAction {
  from: string;
  to: string;
  quantity: string;
  symbol: string;
  date: string;
  direction?: string;
}

export const Tokens: string[] = [
  'eosadddddddd',
  'eosatidiumio',
  'eosblackteam',
  'eosiochaince',
  'challengedac',
  'ednazztokens',
  'eosio.token',
  'eosdactokens',
  'eoxeoxeoxeox',
  'esbcointoken',
  'eosvrtokenss',
  'horustokenio',
  'oo1122334455',
  'everipediaiq',
  'irespotokens',
  'therealkarma',
  'octtothemoon',
  'poormantoken',
  'wizznetwork1',
  'ridlridlcoin'
];

