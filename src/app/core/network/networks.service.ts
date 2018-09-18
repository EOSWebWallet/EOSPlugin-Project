import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map, first } from 'rxjs/internal/operators';

import { IAppState } from '../state/state.interface';
import { INetwork } from './network.interface';

import { AbstractActionService } from '../state/actions.service';
import { SettingsService } from '../settings/settings.service';

import { IPlugin } from '../plugin/plugin.interface';

import { PluginUtils } from '../plugin/plugin.utils';

@Injectable()
export class NetworksService extends AbstractActionService {

  constructor(
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

  setNetworks(networks: INetwork[]): void {
    this.store
      .pipe(
        select(state => state.plugin),
        map(pluginState => pluginState.plugin),
        first()
      )
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
