import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map, first } from 'rxjs/internal/operators';

import { IAppState } from '../state/state.interface';
import { IUIState } from './ui.interface';
import { IPlugin } from '../plugin/plugin.interface';

import { AbstractStateService } from '../state/state.service';

import { Plugins } from '../plugin/plugin';

@Injectable()
export class UIService extends AbstractStateService {

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  get state$(): Observable<IUIState> {
    return this.plugin$
      .pipe(
        map(plugin => plugin.keychain && plugin.keychain.state)
      );
  }

  setState(key: string, value: any): void {
    this.state$
      .pipe(
        first()
      )
      .subscribe(state => this.dispatchAction(Plugins.PLUGIN_STORE_UI, {
        ...state,
        [key]: value
      }));
  }

  getState(key: string): Observable<any> {
    return this.state$
      .pipe(
        map(state => state[key])
      );
  }

  resetState(): void {
    this.dispatchAction(Plugins.PLUGIN_STORE_UI, null);
  }
}
