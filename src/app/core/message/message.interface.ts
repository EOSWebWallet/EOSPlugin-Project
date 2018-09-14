export interface IExtensionMessage {
  type: string;
  payload?: string;
}

export enum ExtensionMessageType {
  SET_SEED = 'SET_SEED',
  STORE_PLUGIN = 'STORE_PLUGIN',
}
