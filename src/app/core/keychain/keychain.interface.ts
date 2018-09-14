import { IKeypair } from '../keypair/keypair.interface';

export interface IKeychain {
  keypairs: IKeypair[];
}
