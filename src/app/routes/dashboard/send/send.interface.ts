import { ISignatureResult } from '../../../core/eos/eos.interface';

export interface ISendParams {
  recipient: string;
  quantity: number;
  symbol: string;
  memo?: string;
}

export interface ISignupOptions {
  signup: (result: ISignatureResult) => void;
  signargs: any;
}
