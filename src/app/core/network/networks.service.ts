import { HttpClient } from '@angular/common/http';
import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map, first, filter } from 'rxjs/internal/operators';
import { from } from 'rxjs/internal/observable/from';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

import { IAccount } from '../account/account.interface';
import { IAppState } from '../state/state.interface';
import { INetwork } from './network.interface';

import { AbstractEntityService } from '../state/state.service';
import { SettingsService } from '../settings/settings.service';
import { AccountService } from '../account/account.service';

import { IPlugin } from '../plugin/plugin.interface';

import { Plugins } from '../plugin/plugin';

@Injectable()
export class NetworksService extends AbstractEntityService {
  static PREFIX_ID = 'NETWORK_';

  constructor(
    private httpClient: HttpClient,
    protected actions: Actions,
    protected store: Store<IAppState>,
    private settingsService: SettingsService,
    private accountService: AccountService
  ) {
    super();
  }

  get networks$(): Observable<INetwork[]> {
    return this.settingsService.settings$
      .pipe(
        map(settings => settings.networks)
      );
  }

  get selectedNetwork$(): Observable<INetwork> {
    return this.networks$
      .pipe(
        map(networks => networks.find(n => n.selected))
      );
  }

  save(network: INetwork): void {
    this.networks$
      .pipe(
        first(),
      )
      .subscribe(networks =>
        this.set([
          ...networks,
          {
            ...network,
            id: this.createId(networks)
          }
        ])
      );
  }

  update(id: string, network: INetwork): void {
    this.networks$
      .pipe(
        first(),
      )
      .subscribe(networks =>
        this.set(networks.map(n => n.id === id ? network : n))
      );
  }

  delete(id: string): void {
    combineLatest(
      this.networks$,
      this.accountService.accounts$
    )
    .pipe(
      first()
    )
    .subscribe(([ networks, accounts ]) =>
      this.set(networks.filter(n => n.id !== id), accounts.filter(a => a.network.id !== id))
    );
  }

  select(id: string): void {
    this.networks$
      .pipe(first())
      .subscribe(networks =>
        this.set(networks.map(n => ({
          ...n,
          selected: n.id === id
            ? !n.selected
            : false
        })))
      );
  }

  private set(networks: INetwork[], accounts: IAccount[] = null): void {
    this.plugin$
      .pipe(first())
      .subscribe((plugin: IPlugin) =>
        this.dispatchAction(Plugins.PLUGIN_STORE, {
          ...plugin,
          keychain: {
            ...plugin.keychain,
            accounts: (accounts ? accounts : plugin.keychain.accounts)
              .map(a => ({
                ...a,
                accounts: a.accounts
                  .map(na => ({ ...na, selected: false }))
              }))
          },
          settings: {
            ...plugin.settings,
            networks: networks
          }
        })
      );
  }
}
