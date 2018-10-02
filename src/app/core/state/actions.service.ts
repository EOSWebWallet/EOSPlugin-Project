import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/internal/Observable';
import { map, first, filter } from 'rxjs/internal/operators';

import { IAppState, SafeAction } from './state.interface';
import { IPlugin } from '../plugin/plugin.interface';

export abstract class AbstractActionService {

  protected abstract actions: Actions;
  protected abstract store: Store<IAppState>;

  get plugin$(): Observable<IPlugin> {
    return this.store
      .pipe(
        select(state => state.plugin),
        map(pluginState => pluginState.plugin),
        filter(Boolean),
      );
  }

  dispatchAction<T>(type: string, payload: T = null): void {
    const action: SafeAction<T> = { type, payload };
    return this.store.dispatch<SafeAction<T>>(action);
  }

  getAction(action: string): Observable<any> {
    return this.actions
      .pipe(
        ofType(action)
      );
  }

  getPayload<T>(type: string): Observable<T> {
    return this.actions
      .pipe(
        ofType(type),
        map((action: SafeAction<T>) => action.payload)
      );
  }
}
