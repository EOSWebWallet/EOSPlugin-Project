import { Action } from '@ngrx/store';

import { IPluginState } from '../plugin/plugin.interface';

export interface IAppState {
  plugin?: IPluginState;
}

export interface UnsafeAction extends Action {
  payload?: any;
}

export interface SafeAction<T> extends Action {
  payload: T;
}
