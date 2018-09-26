export interface IPermission {
  domain: string;
  network: string;
  identity: string;
  keypair: string;

  contract?: any;
  action?: any;
  checksum?: any;
  timestamp?: number;
  fields?: any[];
  mutableFields?: any[];
}
