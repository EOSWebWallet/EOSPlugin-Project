import { SafeAction, UnsafeAction } from '../../core/state/state.interface';

import { IPluginState, IPlugin } from './plugin.interface';

import { PluginService } from './plugin.service';

export const defaultState: IPluginState = {
  plugin: null,
};

export function reducer(
  state: IPluginState = defaultState,
  action: UnsafeAction
): IPluginState {
  switch (action.type) {
    case PluginService.PLUGIN_STORE_SUCCESS:
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
