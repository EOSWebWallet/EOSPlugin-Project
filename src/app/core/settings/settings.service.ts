import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

import { IAppState } from '../state/state.interface';
import { ISettings } from './settings.interface';

import { AbstractActionService } from '../state/actions.service';

@Injectable()
export class SettingsService extends AbstractActionService {

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  get settings$(): Observable<ISettings> {
    return this.plugin$
      .pipe(
        map(plugin => plugin.settings)
      );
  }
}
