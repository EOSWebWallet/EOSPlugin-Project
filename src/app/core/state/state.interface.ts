import { Action } from '@ngrx/store';

import { EOSPlugin } from '../plugin/plugin';

export interface IAppState {
  plugin?: EOSPlugin;
}

export interface UnsafeAction extends Action {
  payload?: any;
}

export interface SafeAction<T> extends Action {
  payload: T;
}
