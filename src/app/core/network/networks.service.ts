import { HttpClient } from '@angular/common/http';
import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map, first, filter } from 'rxjs/internal/operators';
import { from } from 'rxjs/internal/observable/from';

import { IAppState } from '../state/state.interface';
import { INetwork } from './network.interface';

import { AbstractEntityService } from '../state/state.service';
import { SettingsService } from '../settings/settings.service';

import { IPlugin } from '../plugin/plugin.interface';

import { PluginUtils } from '../plugin/plugin.utils';
import { NetworkUtils } from './network.utils';

@Injectable()
export class NetworksService extends AbstractEntityService {
  static PREFIX_ID = 'NETWORK_';

  constructor(
    private httpClient: HttpClient,
    protected actions: Actions,
    protected store: Store<IAppState>,
    private settingsService: SettingsService
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
    this.networks$
      .pipe(
        first()
      )
      .subscribe(networks =>
        this.set(networks.filter(n => n.id !== id))
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

  private set(networks: INetwork[]): void {
    this.plugin$
      .pipe(first())
      .subscribe((plugin: IPlugin) =>
        this.dispatchAction(PluginUtils.PLUGIN_STORE, {
          ...plugin,
          settings: {
            ...plugin.settings,
            networks: networks
          }
        })
      );
  }
}
