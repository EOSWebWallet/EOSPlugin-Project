import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

import { IAppState } from '../state/state.interface';
import { ISettings } from './settings.interface';

@Injectable()
export class SettingsService {

  constructor(
    private store: Store<IAppState>,
  ) {}

  get settings$(): Observable<ISettings> {
    return this.store
      .pipe(
        select(state => state.plugin),
        map(pluginState => pluginState.plugin),
        map(plugin => plugin.settings)
      );
  }
}
