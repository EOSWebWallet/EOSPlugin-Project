import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, filter } from 'rxjs/internal/operators';

import { INavLink } from './layout.interface';
import { INetwork } from '../core/network/network.interface';

import { NetworksService } from '../core/network/networks.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: [ './layout.component.scss' ],
})
export class LayoutComponent {

  navLinks: INavLink[] = [
    { icon: 'icon-home', path: 'home' },
    { icon: 'icon-user', path: 'user' },
    { icon: 'icon-key', path: 'keys' },
    { icon: 'icon-settings', path: 'settings' }
  ];

  constructor(
    private networkService: NetworksService,
  ) { }

  get selectedNetwork$(): Observable<string> {
    return this.networkService.selectedNetwork$
      .pipe(
        map(network => network ? network.name : '')
      );
  }

  get networks$(): Observable<INetwork[]> {
    return this.networkService.networks$;
  }

  onSelectNetwork(network: INetwork): void {
    if (!network.selected) {
      this.networkService.select(network.id);
    }
  }
}
