import { ISignatureResult } from '../../../core/eos/eos.interface';
import { IKeypair } from '../../../core/keypair/keypair.interface';

export interface ISendParams {
  recipient: string;
  quantity: number;
  symbol: string;
  memo?: string;
}

export interface ISignupOptions {
  signup: (result: ISignatureResult) => void;
  signargs: any;
  keypair: IKeypair;
}
