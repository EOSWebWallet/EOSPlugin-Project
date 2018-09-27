import { IAccountFields } from '../account/account.interface';

export interface IPrompt {
  type: PromptType;
  responder: Function;
  requirements?: IAccountFields;
  domain?: string;
}

export enum PromptType {
  REQUEST_IDENTITY,
}
