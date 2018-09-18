import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map, first } from 'rxjs/internal/operators';

import { IAppState } from '../state/state.interface';
import { IAccount } from './account.interface';
import { IPlugin } from '../plugin/plugin.interface';

import { AbstractActionService } from '../state/actions.service';

import { PluginUtils } from '../plugin/plugin.utils';

@Injectable()
export class AccountService extends AbstractActionService {

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  get accounts$(): Observable<IAccount[]> {
    return this.plugin$
      .pipe(
        map(plugin => plugin.keychain.accounts)
      );
  }

  setAccounts(accounts: IAccount[]): void {
    this.plugin$
      .pipe(first())
      .subscribe((plugin: IPlugin) =>
        this.dispatchAction(PluginUtils.PLUGIN_STORE, {
          ...plugin,
          keychain: {
            ...plugin.keychain,
            accounts
          }
        })
      );
  }
}
