export interface IAccountIdentity {
  publicKey: string;
  accounts: INetworkIdentityAccount[];
}

export interface INetworkIdentityAccount {
  name: string;
  authority: string;
  blockchain: string;
}
