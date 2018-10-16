import { INetwork } from '../network/network.interface';
import { IAccountIdentity } from '../account/account.interface';

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
  identity: IAccountIdentity;
  signargs: any;
}

export enum PromptType {
  REQUEST_IDENTITY = 'REQUEST_IDENTITY',
  REQUEST_SIGNATURE = 'REQUEST_SIGNATURE',
}
