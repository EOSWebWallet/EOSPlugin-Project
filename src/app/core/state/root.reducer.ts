import { IAppState } from './state.interface';

import * as plugin from '../plugin/plugin.reducer';

export const reducers = {
  plugin: plugin.reducer,
};

export const initialState: Partial<IAppState> = {
  plugin: plugin.defaultState,
};
