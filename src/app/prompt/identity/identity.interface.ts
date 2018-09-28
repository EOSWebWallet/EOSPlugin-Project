import { INetworkAccount } from "../../core/network/network.interface";

export interface IAccountIdentity {
  publicKey: string;
  account: INetworkAccount;
}
