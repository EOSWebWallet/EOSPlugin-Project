import { UnsafeAction } from '../../core/state/state.interface';

import { IPluginState, IPlugin } from './plugin.interface';

import { Plugins } from './plugin';

export const defaultState: IPluginState = {
  plugin: null,
};

export function reducer(
  state: IPluginState = defaultState,
  action: UnsafeAction
): IPluginState {
  switch (action.type) {
    case Plugins.PLUGIN_LOAD_SUCCESS:
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
