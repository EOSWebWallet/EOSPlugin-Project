import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/internal/Observable';
import { map, first, filter } from 'rxjs/internal/operators';

import { IAppState, IStateEntity, UnsafeAction } from './state.interface';
import { IPlugin } from '../plugin/plugin.interface';

import { PluginUtils } from '../plugin/plugin.utils';

export abstract class AbstractStateService {

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

  dispatchAction(type: string, payload?: any): void {
    const action: UnsafeAction = { type, payload };
    return this.store.dispatch<UnsafeAction>(action);
  }

  getAction(action: string): Observable<any> {
    return this.actions
      .pipe(
        ofType(action)
      );
  }
}

export abstract class AbstractEntityService extends AbstractStateService {

  protected prefix = 'id';

  protected createId(entities: IStateEntity[]): string {
    const last = entities
      .map(n => n.id)
      .filter(n => n.startsWith(this.prefix))
      .map(n => parseInt(n.replace(this.prefix, ''), 10))
      .sort((a, b) => a - b)
      .pop() || 0;
    return this.prefix + (last + 1);
  }
}
