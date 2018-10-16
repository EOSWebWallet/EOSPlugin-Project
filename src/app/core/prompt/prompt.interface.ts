import { INetwork, INetworkAccount } from '../network/network.interface';

export interface IPromptOptions {
  type: PromptType;
  responder: Function;
}

export interface IIdentityPromtOptions extends IPromptOptions {
  type: PromptType.REQUEST_IDENTITY;
  network: INetwork;
}

export interface ISignaturePromtOptions extends IPromptOptions {
  type: PromptType.REQUEST_SIGNATURE;
  network: INetwork;
  networkAccount: INetworkAccount;
  signargs: any;
}

export enum PromptType {
  REQUEST_IDENTITY = 'REQUEST_IDENTITY',
  REQUEST_SIGNATURE = 'REQUEST_SIGNATURE',
}
