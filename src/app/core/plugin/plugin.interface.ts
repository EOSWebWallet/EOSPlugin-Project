import { IKeychain } from '../keychain/keychain.interface';

export interface IPluginState {
  plugin: IPlugin;
}

export interface IPlugin {
  keychain: IKeychain;
  hasEncryptionKey?: boolean;
}
