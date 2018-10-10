import { HttpClient } from '@angular/common/http';
import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map, first } from 'rxjs/internal/operators';
import { from } from 'rxjs/internal/observable/from';

import { IAppState } from '../state/state.interface';
import { INetwork } from './network.interface';

import { AbstractActionService } from '../state/actions.service';
import { SettingsService } from '../settings/settings.service';

import { IPlugin } from '../plugin/plugin.interface';

import { PluginUtils } from '../plugin/plugin.utils';
import { NetworkUtils } from './network.utils';

@Injectable()
export class NetworksService extends AbstractActionService {

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
      .pipe(first())
      .subscribe(networks =>
        this.set([ ...networks, network ])
      );
  }

  update(network: INetwork): void {
    this.networks$
      .pipe(first())
      .subscribe(networks =>
        this.set(networks.map(n => n.name === network.name ? network : n))
      );
  }

  delete(network: INetwork): void {
    this.networks$
      .pipe(first())
      .subscribe(networks =>
        this.set(networks.filter(n => n.name !== network.name))
      );
  }

  select(network: INetwork): void {
    this.networks$
      .pipe(first())
      .subscribe(networks =>
        this.set(networks.map(n => ({
          ...n,
          selected: n === network
            ? !network.selected
            : n.selected
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
