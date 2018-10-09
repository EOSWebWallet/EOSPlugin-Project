import { IPlugin } from '../plugin/plugin.interface';
import { IAccountIdentity } from '../account/account.interface';

export interface ISigner {
  requestSignature: (signargs: any) => void;
}

export interface ISignatureOptions {
  plugin: IPlugin;
  identity: IAccountIdentity;
  privateKey: string;
  payload: any;
}

export interface ISignatureResult {
  signatures: any[];
}
