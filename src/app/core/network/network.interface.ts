export interface INetwork {
  id?: string;
  protocol?: string;
  name?: string;
  host?: string;
  port?: number;
  selected?: boolean;
}

export interface INetworkAccount {
  name: string;
  authority: string;
  selected?: boolean;
}
