import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators';

import { IAppState } from '../state/state.interface';
import { INetwork } from './network.interface';

import { SettingsService } from '../settings/settings.service';

@Injectable()
export class NetworksService {

  constructor(
    private store: Store<IAppState>,
    private settingsService: SettingsService
  ) {}

  get networks$(): Observable<INetwork[]> {
    return this.settingsService.settings$
      .pipe(
        map(settings => settings.networks)
      );
  }

  setNetworks(networks: INetwork[]): void {

  }
}
