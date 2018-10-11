import { UnsafeAction } from '../../core/state/state.interface';

import { IPluginState, IPlugin } from './plugin.interface';

import { PluginUtils } from './plugin.utils';

export const defaultState: IPluginState = {
  plugin: null,
};

export function reducer(
  state: IPluginState = defaultState,
  action: UnsafeAction
): IPluginState {
  switch (action.type) {
    case PluginUtils.PLUGIN_STORE_SUCCESS:
    case PluginUtils.PLUGIN_LOAD_SUCCESS:
    case PluginUtils.PLUGIN_IMPORT_SUCCESS:
      return {
        plugin: action.payload
      };
    default:
      return state;
  }
}

export const plugin = {
  defaultState,
  reducer,
};
