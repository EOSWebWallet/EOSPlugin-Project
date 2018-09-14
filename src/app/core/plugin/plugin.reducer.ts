import { SafeAction } from '../../core/state/state.interface';

import { IPluginState } from './plugin.interface';

import { PluginService } from './plugin.service';

export const defaultState: IPluginState = {
  plugin: null,
};

export function reducer(
  state: IPluginState = defaultState,
  action: SafeAction<IPluginState>
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
