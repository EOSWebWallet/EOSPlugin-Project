import { IKeychain } from '../keychain/keychain.interface';
import { ISettings } from '../settings/settings.interface';
import { IUIState } from '../ui/ui.interface';

export interface IPluginState {
  plugin: IPlugin;
}

export interface IPlugin {
  keychain: IKeychain;
  settings: ISettings;
  hasEncryptionKey?: boolean;
}
