import { IAccountFields } from '../account/account.interface';
import { INetwork } from '../network/network.interface';

export interface IPrompt {
  type: PromptType;
  responder: Function;
  requirements?: IAccountFields;
  domain?: string;
  network?: INetwork;
  payload?: any;
}

export enum PromptType {
  REQUEST_IDENTITY = 'REQUEST_IDENTITY',
  REQUEST_SIGNATURE = 'REQUEST_SIGNATURE',
}
