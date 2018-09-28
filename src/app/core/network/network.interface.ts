export interface INetwork {
  protocol?: string;
  name: string;
  host: string;
  port: number;
  selected?: boolean;
}

export interface INetworkAccount {
  name: string;
  authority: string;
  selected?: boolean;
}
