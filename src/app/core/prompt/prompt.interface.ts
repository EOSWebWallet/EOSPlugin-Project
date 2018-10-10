import { IAccount } from '../account/account.interface';

export interface IPromptOptions {
  type: PromptType;
  responder: Function;
}

export interface IIdentityPromtOptions extends IPromptOptions {
  type: PromptType.REQUEST_IDENTITY;
  accounts: IAccount[];
}

export interface ISignaturePromtOptions extends IPromptOptions {
  type: PromptType.REQUEST_SIGNATURE;
  account: IAccount;
  signargs: any;
}

export enum PromptType {
  REQUEST_IDENTITY = 'REQUEST_IDENTITY',
  REQUEST_SIGNATURE = 'REQUEST_SIGNATURE',
}
